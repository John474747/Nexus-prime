import { Router } from "express";

const router = Router();

router.post("/scan/decode", (req, res) => {
  const { data } = req.body;
  if (!data) {
    return res.status(400).json({ error: "QR data required" });
  }
  res.json({
    type: "transfer",
    amount: 5000,
    recipientName: "Chidi Okonkwo",
    recipientId: "u1",
    accountNumber: "0123456780",
    bankName: "Nex MFB",
  });
});

router.post("/scan/pay", (req, res) => {
  const { qrData, amount } = req.body;
  if (!qrData || !amount) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  res.json({
    success: true,
    reference: `QR${Date.now()}`,
    message: `₦${Number(amount).toLocaleString()} payment successful`,
    transactionId: `tx_${Date.now()}`,
  });
});

export default router;
