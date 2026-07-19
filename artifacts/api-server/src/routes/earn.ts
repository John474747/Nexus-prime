import { Router, Request, Response } from "express";
import { logger } from "../lib/logger";

const router = Router();

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Opportunity {
  id: string;
  title: string;
  reward: string;
  rewardRaw: number;
  platform: string;
  platformColor: string;
  category: string;
  status: string;           // "open" | "closed" | "created"
  deadline: string | null;
  url: string;
  description: string;
  tags: string[];
  sponsorLogo?: string;
}

// ─── Full cache (warmed by stream, served by REST) ────────────────────────────

interface FullCache { items: Opportunity[]; ts: number }
let fullCache: FullCache | null = null;
const CACHE_TTL = 5 * 60 * 1000;
function cacheValid() { return !!fullCache && Date.now() - fullCache!.ts < CACHE_TTL; }

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalizeCategory(hint: string): string {
  const h = hint.toLowerCase();
  if (/design|ui|ux|figma|graphic|creative/.test(h)) return "Design";
  if (/dev|code|contract|rust|solana|program|engineer|sdk/.test(h)) return "Development";
  if (/security|audit|pentest|bug.?bounty/.test(h)) return "Security";
  if (/content|write|doc|blog|article|copy|translate/.test(h)) return "Content";
  if (/grant/.test(h)) return "Grant";
  return "Bounty";
}

function fmtDeadline(iso: string | null | undefined): string | null {
  if (!iso) return null;
  try { return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
  catch { return null; }
}

// ─── Provider: Superteam Earn — fetch one page ───────────────────────────────

async function fetchSuperteamPage(type: "bounty" | "project", skip: number): Promise<Opportunity[]> {
  const res = await fetch(
    `https://earn.superteam.fun/api/listings?take=30&skip=${skip}&type=${type}`,
    { headers: { Accept: "application/json", "User-Agent": "nexMonie/1.0" }, signal: AbortSignal.timeout(12000) }
  );
  if (!res.ok) throw new Error(`ST ${res.status}`);
  const body = await res.json();
  const items: any[] = Array.isArray(body) ? body : Object.values(body);
  if (!items.length) return [];

  return items.map((item: any) => {
    const amount = item.rewardAmount ?? item.maxRewardAsk ?? 0;
    const token = item.token ?? "USDC";
    const reward =
      item.compensationType === "range" && item.minRewardAsk && item.maxRewardAsk
        ? `${item.minRewardAsk.toLocaleString()}–${item.maxRewardAsk.toLocaleString()} ${token}`
        : amount > 0 ? `${amount.toLocaleString()} ${token}` : "Open";
    const slug = item.slug ?? item.id;
    const ltype = (item.type ?? "bounty").toLowerCase();
    const urlPath = ltype === "project" ? "projects" : ltype === "hackathon" ? "hackathons" : "bounties";
    return {
      id: `st-${item.id}`,
      title: item.title ?? "Untitled",
      reward, rewardRaw: amount,
      platform: "Superteam Earn", platformColor: "#9945FF",
      category: normalizeCategory(`${item.type ?? ""} ${(item.skills ?? []).join(" ")}`),
      status: (item.status ?? "open").toLowerCase(),
      deadline: fmtDeadline(item.deadline),
      url: `https://earn.superteam.fun/listings/${urlPath}/${slug}/`,
      description: item.description ?? "",
      tags: [item.sponsor?.name ?? "Superteam", item.type ?? "Bounty"].filter(Boolean),
      sponsorLogo: item.sponsor?.logo,
    };
  });
}

// Fetch all Superteam pages sequentially per type to avoid rate-limiting
async function* superteamPages(): AsyncGenerator<Opportunity[]> {
  for (const type of ["bounty", "project"] as const) {
    let skip = 0;
    while (skip <= 900) {
      try {
        const items = await fetchSuperteamPage(type, skip);
        if (!items.length) break;   // no more pages
        yield items;
        if (items.length < 30) break; // partial page → last page
        skip += 30;
      } catch {
        break;
      }
    }
  }
}

// ─── Provider: Gibwork — fetch one page ──────────────────────────────────────

async function fetchGibworkPage(page: number): Promise<{ items: Opportunity[]; lastPage: number }> {
  const res = await fetch(
    `https://api.gib.work/explore?page=${page}&limit=30`,
    { headers: { Accept: "application/json", "User-Agent": "nexMonie/1.0" }, signal: AbortSignal.timeout(12000) }
  );
  if (!res.ok) throw new Error(`GW ${res.status}`);
  const body = await res.json();
  const raw: any[] = Array.isArray(body) ? body : (body.results ?? []);
  const lastPage: number = body.lastPage ?? 1;

  const items: Opportunity[] = raw
    .filter((x: any) => x?.isHidden !== true)   // show all non-hidden (open + closed)
    .map((item: any) => {
      const decimals = item.asset?.decimals ?? 6;
      const pool = Number(item.asset?.amount ?? 0) / Math.pow(10, decimals);
      const sym = item.asset?.symbol ?? "USDC";
      const tagHint = (item.tags ?? []).join(" ");
      const gwStatus = item.isOpen ? "open" : (item.status ?? "created").toLowerCase();
      return {
        id: `gw-${item.id}`,
        title: item.title ?? "Untitled",
        reward: pool > 0 ? `${pool.toLocaleString()} ${sym}` : "Open",
        rewardRaw: pool,
        platform: "Gibwork", platformColor: "#25579C",
        category: normalizeCategory(tagHint),
        status: gwStatus,
        deadline: fmtDeadline(item.deadline),
        url: `https://app.gib.work/tasks/${item.id}`,
        description: (item.content ?? "").replace(/<[^>]+>/g, "").slice(0, 200),
        tags: [
          item.user?.username ? `@${item.user.username}` : "Gibwork",
          ...(item.tags ?? []).slice(0, 2),
        ].filter(Boolean),
        sponsorLogo: item.user?.profilePicture,
      };
    });

  return { items, lastPage };
}

// ─── SSE helper ──────────────────────────────────────────────────────────────

function sse(res: Response, event: string, data: unknown) {
  try {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    (res as any).flush?.();
  } catch { /* client gone */ }
}

// ─── Stream endpoint  GET /api/earn/stream ────────────────────────────────────

router.get("/earn/stream", async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  let closed = false;
  req.on("close", () => { closed = true; });

  const hb = setInterval(() => { if (!closed) res.write(": ping\n\n"); }, 20000);

  // Serve from cache instantly if warm
  if (cacheValid()) {
    sse(res, "batch", { items: fullCache!.items, source: "cache", running: fullCache!.items.length });
    sse(res, "complete", { total: fullCache!.items.length, fromCache: true });
    clearInterval(hb);
    return res.end();
  }

  const allItems: Opportunity[] = [];
  const seen = new Set<string>();

  function push(items: Opportunity[], source: string) {
    if (closed) return;
    const fresh = items.filter(i => !seen.has(i.id));
    fresh.forEach(i => seen.add(i.id));
    if (!fresh.length) return;
    allItems.push(...fresh);
    sse(res, "batch", { items: fresh, source, running: allItems.length });
  }

  // ── Gibwork: page 1 first (get lastPage), then fan out all remaining pages ──
  const gibworkExtra: Promise<void>[] = [];
  try {
    const { items: gw1, lastPage } = await fetchGibworkPage(1);
    push(gw1, "Gibwork");
    for (let p = 2; p <= lastPage; p++) {
      const pg = p;
      gibworkExtra.push(
        fetchGibworkPage(pg)
          .then(({ items }) => push(items, "Gibwork"))
          .catch(err => { if (!closed) logger.warn({ err, pg }, "Gibwork page failed"); })
      );
    }
  } catch (err) {
    logger.error({ err }, "Gibwork page 1 failed");
    if (!closed) sse(res, "providerError", { platform: "Gibwork", message: "Gibwork unavailable" });
  }

  // ── Superteam: async generator, batched to avoid rate-limiting ──
  const superteamDone = (async () => {
    try {
      for await (const batch of superteamPages()) {
        push(batch, "Superteam Earn");
        if (closed) break;
      }
    } catch (err) {
      logger.error({ err }, "Superteam provider failed");
      if (!closed) sse(res, "providerError", { platform: "Superteam Earn", message: "Superteam unavailable" });
    }
  })();

  await Promise.allSettled([...gibworkExtra, superteamDone]);

  if (allItems.length > 0) {
    fullCache = { items: [...allItems], ts: Date.now() };
  }

  if (!closed) {
    sse(res, "complete", {
      total: allItems.length,
      fromCache: false,
      providers: {
        gibwork: allItems.filter(i => i.platform === "Gibwork").length,
        superteam: allItems.filter(i => i.platform === "Superteam Earn").length,
      },
    });
    clearInterval(hb);
    res.end();
  } else {
    clearInterval(hb);
  }
});

// ─── REST snapshot  GET /api/earn/opportunities ───────────────────────────────

router.get("/earn/opportunities", (_req: Request, res: Response) => {
  if (cacheValid()) {
    return res.json({ opportunities: fullCache!.items, total: fullCache!.items.length, fromCache: true, cachedAt: new Date(fullCache!.ts).toISOString() });
  }
  res.json({ opportunities: [], total: 0, fromCache: false, warming: true });
});

export default router;
