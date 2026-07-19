import { Router } from "express";

const router = Router();

router.get("/wallet", (_req, res) => {
  res.json({
    availableBalance: 1250000,
    ledgerBalance: 1250000,
    accountNumber: "0123456789",
    accountName: "Nex Monie User",
    bankName: "Nex MFB",
  });
});

export default router;
