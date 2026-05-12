import { Router, type IRouter } from "express";
import healthRouter from "./health";
import chatRouter from "./chat";
import intakeRouter from "./intake";

const router: IRouter = Router();

router.use(healthRouter);
router.use(chatRouter);
router.use(intakeRouter);

export default router;
