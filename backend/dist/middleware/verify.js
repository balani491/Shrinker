"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//@ts-ignore
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // console.log("No header");
        return res.status(403).json({ "message": "Invalid token" });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        //@ts-ignore
        req.userId = decoded.userId;
        //@ts-ignore
        next();
    }
    catch (err) {
        // console.log("erro")
        return res.status(403).json({
            message: "Invalid token"
        });
    }
};
exports.default = authMiddleware;
