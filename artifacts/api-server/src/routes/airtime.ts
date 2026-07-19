import { Router } from "express";

const router = Router();

router.get("/airtime/networks", (_req, res) => {
  res.json([
    { id: "mtn", name: "MTN", logo: "M", color: "#FFC300" },
    { id: "airtel", name: "Airtel", logo: "A", color: "#E60000" },
    { id: "glo", name: "Glo", logo: "G", color: "#3AA935" },
    { id: "9mobile", name: "9mobile", logo: "9", color: "#006747" },
  ]);
});

router.post("/airtime/purchase", (req, res) => {
  const { networkId, phoneNumber, amount } = req.body;
  if (!networkId || !phoneNumber || !amount) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  res.json({
    success: true,
    reference: `AIR${Date.now()}`,
    message: `₦${Number(amount).toLocaleString()} airtime successfully sent to ${phoneNumber}`,
    transactionId: `tx_${Date.now()}`,
  });
});

export default router;
