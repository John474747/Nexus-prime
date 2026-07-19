import { Router } from "express";

const router = Router();

router.post("/transfers/send", (req, res) => {
  const { type, amount } = req.body;
  if (!type || !amount) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  res.json({
    success: true,
    reference: `TRF${Date.now()}`,
    message: `₦${Number(amount).toLocaleString()} sent successfully`,
    transactionId: `tx_${Date.now()}`,
  });
});

export default router;
