import { Router } from "express";
import health from "./health";
import wallet from "./wallet";
import transactions from "./transactions";
import airtime from "./airtime";
import data from "./data";
import bills from "./bills";
import banks from "./banks";
import transfers from "./transfers";
import users from "./users";
import scan from "./scan";
import earn from "./earn";

const router = Router();

router.use(health);
router.use(wallet);
router.use(transactions);
router.use(airtime);
router.use(data);
router.use(bills);
router.use(banks);
router.use(transfers);
router.use(users);
router.use(scan);
router.use(earn);

export default router;
