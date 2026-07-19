import { Router } from "express";

const router = Router();

const MOCK_TRANSACTIONS = [
  {
    id: "tx_001",
    type: "credit",
    title: "Salary Payment",
    description: "Monthly salary from Acme Corp",
    amount: 500000,
    category: "Income",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: "success",
    reference: "REF001",
  },
  {
    id: "tx_002",
    type: "debit",
    title: "Buy Airtime",
    description: "MTN 1000 airtime for 08012345678",
    amount: 1000,
    category: "Airtime",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    status: "success",
    reference: "REF002",
  },
  {
    id: "tx_003",
    type: "debit",
    title: "DSTV Subscription",
    description: "DSTV Compact - Monthly",
    amount: 9900,
    category: "Cable TV",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: "success",
    reference: "REF003",
  },
  {
    id: "tx_004",
    type: "credit",
    title: "Transfer from Chidi",
    description: "Split bill payment",
    amount: 25000,
    category: "Transfer",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "success",
    reference: "REF004",
  },
  {
    id: "tx_005",
    type: "debit",
    title: "Electricity Bill",
    description: "EKEDC prepaid recharge",
    amount: 15000,
    category: "Electricity",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: "success",
    reference: "REF005",
  },
  {
    id: "tx_006",
    type: "debit",
    title: "Send Money",
    description: "Transfer to Amaka Obi",
    amount: 50000,
    category: "Transfer",
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: "success",
    reference: "REF006",
  },
  {
    id: "tx_007",
    type: "debit",
    title: "Data Bundle",
    description: "Airtel 4.5GB - 30 Days",
    amount: 2500,
    category: "Data",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: "success",
    reference: "REF007",
  },
  {
    id: "tx_008",
    type: "credit",
    title: "Freelance Payment",
    description: "UI design project",
    amount: 150000,
    category: "Income",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "success",
    reference: "REF008",
  },
  {
    id: "tx_009",
    type: "debit",
    title: "Betting",
    description: "Sports betting deposit",
    amount: 5000,
    category: "Betting",
    timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    status: "success",
    reference: "REF009",
  },
  {
    id: "tx_010",
    type: "credit",
    title: "Referral Bonus",
    description: "Bonus for referring Emeka",
    amount: 2500,
    category: "Bonus",
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: "success",
    reference: "REF010",
  },
];

router.get("/transactions", (req, res) => {
  const limit = Number(req.query["limit"]) || 20;
  const offset = Number(req.query["offset"]) || 0;
  res.json(MOCK_TRANSACTIONS.slice(offset, offset + limit));
});

router.get("/transactions/summary", (_req, res) => {
  res.json({
    totalInflow: 675000,
    totalOutflow: 83400,
    netGrowth: 591600,
    inflowChange: 12.5,
    outflowChange: -4.2,
  });
});

export default router;
