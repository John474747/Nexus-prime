import { Router } from "express";

const router = Router();

const MOCK_USERS = [
  { id: "u1", displayName: "Chidi Okonkwo", username: "chidi_k", photoUrl: null, accountNumber: "0123456780" },
  { id: "u2", displayName: "Amaka Obi", username: "amaka_o", photoUrl: null, accountNumber: "0123456781" },
  { id: "u3", displayName: "Emeka Eze", username: "emeka_e", photoUrl: null, accountNumber: "0123456782" },
  { id: "u4", displayName: "Ngozi Adeyemi", username: "ngozi_a", photoUrl: null, accountNumber: "0123456783" },
  { id: "u5", displayName: "Seun Bakare", username: "seun_b", photoUrl: null, accountNumber: "0123456784" },
];

router.get("/users/search", (req, res) => {
  const q = String(req.query["q"] || "").toLowerCase();
  if (!q) return res.json([]);
  const results = MOCK_USERS.filter(
    (u) =>
      u.displayName.toLowerCase().includes(q) ||
      (u.username && u.username.toLowerCase().includes(q))
  );
  res.json(results);
});

export default router;
