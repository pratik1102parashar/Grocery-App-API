import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../utils/database";
import { User } from "../entities/User";
import { validationResult } from "express-validator";


export const register = async (req: Request, res: Response): Promise<void> => {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    try {
        const { name, email, password, role } = req.body;

        // Check if the user already exists
        const userRepository = AppDataSource.getRepository(User);
        const existingUser = await userRepository.findOneBy({ email });

        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }


        // Create a new user instance
        const newUser = userRepository.create({ name, email, password: password, role });

        // Save the user to the database
        await userRepository.save(newUser);

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

//  Authenticates a user and returns a JWT token

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ email });

        if (!user) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: "1h" }
        );

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
