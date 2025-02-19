import { Request, Response } from "express";
import { AppDataSource } from "../utils/database";
import { GroceryItem } from "../entities/GroceryItem";
import { Order } from "../entities/Order";

// Repositories
const groceryRepository = AppDataSource.getRepository(GroceryItem);
const orderRepository = AppDataSource.getRepository(Order);

//  Get available grocery items

export const getAvailableGroceryItems = async (req: Request, res: Response): Promise<void> => {
    try {
        const groceries = await groceryRepository.find({ where: { available: true } });
        res.status(200).json({ success: true, data: groceries });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
};

//  Place an order for multiple grocery items

export const placeOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { items } = req.body; // items = [{ groceryId, quantity }]

        if (!items || !Array.isArray(items) || items.length === 0) {
            res.status(400).json({ success: false, message: "Invalid order request" });
            return;
        }

        // Check if all items exist
        const groceryItems = await groceryRepository.findByIds(items.map(item => item.groceryId));

        if (groceryItems.length !== items.length) {
            res.status(400).json({ success: false, message: "One or more grocery items not found" });
            return;
        }

        // Reduce inventory and create order
        for (let item of items) {
            let grocery = groceryItems.find(g => g.id === item.groceryId);
            if (grocery && grocery.quantity >= item.quantity) {
                grocery.quantity -= item.quantity;
            } else {
                res.status(400).json({ success: false, message: `Not enough stock for ${grocery?.name}` });
                return;
            }
        }

        await groceryRepository.save(groceryItems);

        const order = orderRepository.create({ items });
        await orderRepository.save(order);

        res.status(201).json({ success: true, message: "Order placed successfully", order });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
};
