import express from "express";
import { addGroceryItem, updateGroceryItem, deleteGroceryItem, getAllGroceries } from "../controllers/adminController";
import { authenticateJWT, authorizeAdmin } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/grocery", authenticateJWT, authorizeAdmin, addGroceryItem);
router.get("/grocery", authenticateJWT, authorizeAdmin, getAllGroceries);
router.patch("/grocery/:id", authenticateJWT, authorizeAdmin, updateGroceryItem);
router.delete("/grocery/:id", authenticateJWT, authorizeAdmin, deleteGroceryItem);

export default router;
