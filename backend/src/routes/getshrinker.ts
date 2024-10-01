

import express from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import authMiddleware from '../middleware/verify'; 

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET!;
const prisma = new PrismaClient();
const getShrinkerRouter = express.Router();


const generateRandomShortUrl = () => {
    return Math.random().toString(36).substring(2, 8); 
};


//@ts-ignore


getShrinkerRouter.get("/statistics",authMiddleware,async (req, res) => {
    try {
        const urls = await prisma.url.findMany({
            where: {
                //@ts-ignore
                userId: req.userId,
            },
        });
        res.status(200).json(urls);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

getShrinkerRouter.post("/random", authMiddleware, async (req, res) => {
    try {
        const { originalUrl } = req.body; 

        const shortUrl = generateRandomShortUrl();

        
        const createdUrl = await prisma.url.create({
            data: {
                originalUrl: originalUrl,
                shortUrl: shortUrl,
                //@ts-ignore
                userId: req.userId, 
            },
        });

        res.status(201).json({
            message: "Random short URL created successfully!",
            shortUrl: createdUrl.shortUrl,
            originalUrl: createdUrl.originalUrl,
        });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});


//@ts-ignore
getShrinkerRouter.post("/custom", authMiddleware, async (req, res) => {
    try {
        const { originalUrl, customShortUrl } = req.body; 

        
        const existingUrl = await prisma.url.findUnique({
            where: { shortUrl: customShortUrl },
        });

        if (existingUrl) {
            return res.status(409).json({
                message: "Custom short URL already taken.",
            });
        }

        
        const createdUrl = await prisma.url.create({
            data: {
                originalUrl : originalUrl,
                shortUrl: customShortUrl,
                //@ts-ignore    
                userId: req.userId, 
            },
        });

        res.status(201).json({
            message: "Custom short URL created successfully!",
            shortUrl: createdUrl.shortUrl,
            originalUrl: createdUrl.originalUrl,
        });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

export default getShrinkerRouter;
