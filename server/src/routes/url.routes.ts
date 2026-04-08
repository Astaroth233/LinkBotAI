import { Router } from "express";
import { getUrls, createUrl, deleteUrl, redirectUrl } from "../controllers/url.controller";
import { verifyToken } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { validateObjectId } from "../middleware/objectId.middleware";
import { createUrlSchema } from "../schemas/url.schema";

const router: Router = Router();

router.get("/urls", verifyToken, getUrls);
router.post("/urls", verifyToken, validate(createUrlSchema), createUrl);
router.delete("/urls/:id", verifyToken, validateObjectId("id"), deleteUrl);

// Public redirect route
router.get("/r/:code", redirectUrl);

export default router;
