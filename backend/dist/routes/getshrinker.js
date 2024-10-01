"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
const verify_1 = __importDefault(require("../middleware/verify")); // Make sure this middleware is implemented
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
const prisma = new client_1.PrismaClient();
const getShrinkerRouter = express_1.default.Router();
// Helper function to generate a random short URL
const generateRandomShortUrl = () => {
    return Math.random().toString(36).substring(2, 8); // Generates a random string
};
//@ts-ignore
getShrinkerRouter.post("/random", verify_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { originalUrl } = req.body; // No validation, directly accessing the body
        const shortUrl = generateRandomShortUrl();
        // Create a new URL entry in the database
        const createdUrl = yield prisma.url.create({
            data: {
                originalUrl: originalUrl,
                shortUrl: shortUrl,
                //@ts-ignore
                userId: req.userId, // Assuming authMiddleware sets req.userId
            },
        });
        res.status(201).json({
            message: "Random short URL created successfully!",
            shortUrl: createdUrl.shortUrl,
            originalUrl: createdUrl.originalUrl,
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}));
//@ts-ignore
getShrinkerRouter.post("/custom", verify_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { originalUrl, customShortUrl } = req.body; // No validation, directly accessing the body
        // Check if the custom short URL already exists
        const existingUrl = yield prisma.url.findUnique({
            where: { shortUrl: customShortUrl },
        });
        if (existingUrl) {
            return res.status(409).json({
                message: "Custom short URL already taken.",
            });
        }
        // Create a new URL entry in the database
        const createdUrl = yield prisma.url.create({
            data: {
                originalUrl: originalUrl,
                shortUrl: customShortUrl,
                //@ts-ignore    
                userId: req.userId, // Assuming authMiddleware sets req.userId
            },
        });
        res.status(201).json({
            message: "Custom short URL created successfully!",
            shortUrl: createdUrl.shortUrl,
            originalUrl: createdUrl.originalUrl,
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}));
exports.default = getShrinkerRouter;
