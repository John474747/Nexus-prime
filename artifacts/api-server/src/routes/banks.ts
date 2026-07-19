import { Router } from "express";

const router = Router();

const BANKS = [
  { id: "044", name: "Access Bank" },
  { id: "058", name: "GTBank" },
  { id: "057", name: "Zenith Bank" },
  { id: "033", name: "UBA" },
  { id: "011", name: "First Bank" },
  { id: "070", name: "Fidelity Bank" },
  { id: "214", name: "FCMB" },
  { id: "221", name: "Stanbic IBTC" },
  { id: "030", name: "Sterling Bank" },
  { id: "035", name: "Wema Bank" },
  { id: "50515", name: "Moniepoint MFB" },
  { id: "999992", name: "Opay" },
  { id: "999991", name: "PalmPay" },
  { id: "50211", name: "Kuda" },
];

router.get("/banks", (_req, res) => {
  res.json(BANKS);
});

router.get("/bank/resolve-account", (req, res) => {
  const { accountNumber, bankCode } = req.query;
  if (!accountNumber || !bankCode) {
    return res.status(400).json({ error: "accountNumber and bankCode required" });
  }
  const bank = BANKS.find((b) => b.id === bankCode);
  res.json({
    accountName: "JOHN ADEWALE DOE",
    accountNumber: String(accountNumber),
    bankName: bank?.name ?? null,
  });
});

export default router;
