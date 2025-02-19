import { Request, Response } from "express";
import { AppDataSource } from "../utils/database";
import { GroceryItem } from "../entities/GroceryItem";

// Repository instance
const groceryRepository = AppDataSource.getRepository(GroceryItem);

// Add new grocery item

export const addGroceryItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, price, quantity, available } = req.body;

        const newItem = groceryRepository.create({
            name,
            price,
            quantity,
            available: available ?? true,
        });

        const savedItem = await groceryRepository.save(newItem);

        res.status(201).json({ success: true, message: "Grocery item added successfully", item: savedItem });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
};

// Get all grocery items

export const getAllGroceries = async (req: Request, res: Response): Promise<void> => {
    try {
        const groceries = await groceryRepository.find();
        res.status(200).json({ success: true, data: groceries });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
};

// Update grocery item details

export const updateGroceryItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, price } = req.body;

        const grocery = await groceryRepository.findOneBy({ id: parseInt(id) });

        if (!grocery) {
            res.status(404).json({ success: false, message: "Grocery item not found" });
            return;
        }

        grocery.name = name || grocery.name;
        grocery.price = price || grocery.price;

        await groceryRepository.save(grocery);

        res.status(200).json({ success: true, message: "Grocery item updated successfully", item: grocery });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
};

// Delete grocery item

export const deleteGroceryItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const grocery = await groceryRepository.findOneBy({ id: parseInt(id) });

        if (!grocery) {
            res.status(404).json({ success: false, message: "Grocery item not found" });
            return;
        }

        await groceryRepository.remove(grocery);

        res.status(200).json({ success: true, message: "Grocery item deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
};

// Manage inventory (update quantity)

export const updateInventory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        const grocery = await groceryRepository.findOneBy({ id: parseInt(id) });

        if (!grocery) {
            res.status(404).json({ success: false, message: "Grocery item not found" });
            return;
        }

        grocery.quantity = quantity;

        await groceryRepository.save(grocery);

        res.status(200).json({ success: true, message: "Inventory updated successfully", item: grocery });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
};
