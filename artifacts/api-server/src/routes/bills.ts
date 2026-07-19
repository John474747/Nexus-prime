import { Router } from "express";

const router = Router();

const CATEGORIES = [
  { id: "electricity", name: "Electricity", icon: "Zap" },
  { id: "cable", name: "Cable TV", icon: "Tv" },
  { id: "internet", name: "Internet", icon: "Wifi" },
  { id: "betting", name: "Betting", icon: "Target" },
  { id: "education", name: "Education", icon: "GraduationCap" },
];

const PROVIDERS: Record<string, Array<{ id: string; name: string; categoryId: string; logo: string | null }>> = {
  electricity: [
    { id: "ekedc", name: "EKEDC (Eko)", categoryId: "electricity", logo: null },
    { id: "ikedc", name: "IKEDC (Ikeja)", categoryId: "electricity", logo: null },
    { id: "aedc", name: "AEDC (Abuja)", categoryId: "electricity", logo: null },
    { id: "phed", name: "PHED (Port Harcourt)", categoryId: "electricity", logo: null },
  ],
  cable: [
    { id: "dstv", name: "DSTV", categoryId: "cable", logo: null },
    { id: "gotv", name: "GOtv", categoryId: "cable", logo: null },
    { id: "startimes", name: "StarTimes", categoryId: "cable", logo: null },
  ],
  internet: [
    { id: "mtn_data", name: "MTN SME Data", categoryId: "internet", logo: null },
    { id: "smile", name: "Smile", categoryId: "internet", logo: null },
    { id: "spectranet", name: "Spectranet", categoryId: "internet", logo: null },
  ],
  betting: [
    { id: "bet9ja", name: "Bet9ja", categoryId: "betting", logo: null },
    { id: "sportybet", name: "SportyBet", categoryId: "betting", logo: null },
    { id: "1xbet", name: "1xBet", categoryId: "betting", logo: null },
  ],
  education: [
    { id: "waec", name: "WAEC", categoryId: "education", logo: null },
    { id: "jamb", name: "JAMB", categoryId: "education", logo: null },
    { id: "neco", name: "NECO", categoryId: "education", logo: null },
  ],
};

const PACKAGES: Record<string, Array<{ id: string; name: string; amount: number; description: string | null }>> = {
  dstv: [
    { id: "dstv_padi", name: "Padi", amount: 2500, description: "Access to 45+ channels" },
    { id: "dstv_yanga", name: "Yanga", amount: 3500, description: "Access to 55+ channels" },
    { id: "dstv_confam", name: "Confam", amount: 6200, description: "Access to 65+ channels" },
    { id: "dstv_compact", name: "Compact", amount: 9900, description: "Access to 115+ channels" },
    { id: "dstv_plus", name: "Compact Plus", amount: 16600, description: "Access to 135+ channels" },
    { id: "dstv_premium", name: "Premium", amount: 29500, description: "Access to 175+ channels" },
  ],
  gotv: [
    { id: "gotv_supa", name: "Supa", amount: 6400, description: "Access to 75+ channels" },
    { id: "gotv_max", name: "Max", amount: 4850, description: "Access to 55+ channels" },
    { id: "gotv_jolli", name: "Jolli", amount: 3300, description: "Access to 45+ channels" },
  ],
};

router.get("/bills/categories", (_req, res) => {
  res.json(CATEGORIES);
});

router.get("/bills/providers", (req, res) => {
  const category = String(req.query["category"] || "");
  const providers = PROVIDERS[category] || [];
  res.json(providers);
});

router.get("/bills/packages", (req, res) => {
  const provider = String(req.query["provider"] || "");
  const packages = PACKAGES[provider] || [
    { id: "generic_1", name: "Standard", amount: 5000, description: null },
    { id: "generic_2", name: "Premium", amount: 10000, description: null },
  ];
  res.json(packages);
});

router.post("/bills/validate", (req, res) => {
  const { customerRef } = req.body;
  if (!customerRef) {
    return res.status(400).json({ error: "Customer reference required" });
  }
  res.json({
    valid: true,
    customerName: "John Doe",
    address: "12 Lagos Street, VI",
  });
});

router.post("/bills/pay", (req, res) => {
  const { providerId, customerRef, amount } = req.body;
  if (!providerId || !customerRef || !amount) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  res.json({
    success: true,
    reference: `BILL${Date.now()}`,
    message: `Bill payment of ₦${Number(amount).toLocaleString()} successful`,
    transactionId: `tx_${Date.now()}`,
  });
});

export default router;
