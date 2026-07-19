import { Router } from "express";

const router = Router();

const DATA_PLANS: Record<string, Array<{ id: string; title: string; validity: string; price: number }>> = {
  mtn: [
    { id: "m1", title: "500MB", validity: "2 Days", price: 250 },
    { id: "m2", title: "1GB", validity: "7 Days", price: 500 },
    { id: "m3", title: "2GB", validity: "14 Days", price: 1000 },
    { id: "m4", title: "4GB", validity: "30 Days", price: 2500 },
    { id: "m5", title: "10GB", validity: "30 Days", price: 5000 },
    { id: "m6", title: "25GB", validity: "30 Days", price: 10000 },
  ],
  airtel: [
    { id: "a1", title: "500MB", validity: "2 Days", price: 250 },
    { id: "a2", title: "1GB", validity: "7 Days", price: 500 },
    { id: "a3", title: "4.5GB", validity: "30 Days", price: 2500 },
    { id: "a4", title: "15GB", validity: "30 Days", price: 7500 },
    { id: "a5", title: "25GB", validity: "30 Days", price: 12000 },
  ],
  glo: [
    { id: "g1", title: "1.25GB", validity: "14 Days", price: 500 },
    { id: "g2", title: "2.5GB", validity: "30 Days", price: 1000 },
    { id: "g3", title: "7GB", validity: "30 Days", price: 2500 },
    { id: "g4", title: "25GB", validity: "60 Days", price: 12000 },
  ],
  "9mobile": [
    { id: "9-1", title: "1GB", validity: "7 Days", price: 500 },
    { id: "9-2", title: "2GB", validity: "30 Days", price: 1200 },
    { id: "9-3", title: "10GB", validity: "30 Days", price: 5000 },
  ],
};

router.get("/data/plans", (req, res) => {
  const network = String(req.query["network"] || "").toLowerCase();
  const plans = DATA_PLANS[network];
  if (!plans) {
    return res.status(404).json({ error: "Network not found" });
  }
  res.json(plans);
});

router.post("/data/purchase", (req, res) => {
  const { networkId, phoneNumber, planId } = req.body;
  if (!networkId || !phoneNumber || !planId) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  res.json({
    success: true,
    reference: `DATA${Date.now()}`,
    message: `Data bundle successfully activated on ${phoneNumber}`,
    transactionId: `tx_${Date.now()}`,
  });
});

export default router;
