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
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs")); // For password hashing
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = __importDefault(require("zod"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
const prisma = new client_1.PrismaClient();
const signupBody = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6)
});
const signUpRouter = express_1.default.Router();
//@ts-ignore
signUpRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { success, data } = signupBody.safeParse(req.body);
        if (!success) {
            return res.status(400).json({
                message: "Invalid input data"
            });
        }
        const { email, password } = data;
        const existingUser = yield prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            return res.status(409).json({
                message: "Email already taken"
            });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = yield prisma.user.create({
            data: {
                email: email,
                password: hashedPassword
            }
        });
        const userId = user.id;
        const token = jsonwebtoken_1.default.sign({ userId: Number(user.id) }, JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({
            message: "User created successfully",
            token: token
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}));
exports.default = signUpRouter;
