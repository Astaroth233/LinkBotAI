import { Router } from "express";
import { getChats, createChat, getChatById, deleteChat } from "../controllers/chat.controller";
import { verifyToken } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { validateObjectId } from "../middleware/objectId.middleware";
import { createChatSchema } from "../schemas/chat.schema";

const router: Router = Router();

router.get("/chat", verifyToken, getChats);
router.post("/chat", verifyToken, validate(createChatSchema), createChat);
router.get("/chat/:id", verifyToken, validateObjectId("id"), getChatById);
router.delete("/chat/:id", verifyToken, validateObjectId("id"), deleteChat);

export default router;
