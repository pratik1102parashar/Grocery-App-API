import express from "express";
import { getAvailableGroceryItems, placeOrder } from "../controllers/userController";
import { authenticateJWT } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/grocery", getAvailableGroceryItems);
router.post("/order", authenticateJWT, placeOrder);

export default router;
