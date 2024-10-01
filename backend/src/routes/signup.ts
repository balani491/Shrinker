import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs'; // For password hashing
import jwt from "jsonwebtoken";
import zod from "zod";
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const prisma = new PrismaClient();


const signupBody = zod.object({
    email: zod.string().email(),  
    password: zod.string().min(6) 
});

const signUpRouter = express.Router();
//@ts-ignore
signUpRouter.post("/", async (req, res) => {
    try {
        const { success, data } = signupBody.safeParse(req.body);
        if (!success) {
            return res.status(400).json({
                message: "Invalid input data"
            });
        }

        const { email, password } = data;

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already taken"
            });
        }

        
        const hashedPassword = await bcrypt.hash(password, 10);

        
        const user = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword 
            }
        });

        const userId = user.id;

        
        const token = jwt.sign({ userId: Number(user.id) }, JWT_SECRET!, { expiresIn: '1h' });

        
        res.status(201).json({
            message: "User created successfully",
            token: token
        });
    } catch (error: any) {
        
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
});

export default signUpRouter;
