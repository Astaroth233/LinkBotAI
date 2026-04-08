import { Router } from "express";
import { generateMessage, streamMessage } from "../controllers/ai.controller";
import { verifyToken } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { messageSchema } from "../schemas/chat.schema";

const router: Router = Router();

router.post("/ai/generate", verifyToken, validate(messageSchema), generateMessage);
router.get("/ai/stream", verifyToken, streamMessage);

export default router;
