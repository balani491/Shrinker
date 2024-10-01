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
// Define the request body schema using zod
const signupBody = zod_1.default.object({
    email: zod_1.default.string().email(), // Email field with validation
    password: zod_1.default.string().min(6) // Password must be at least 6 characters
});
const signUpRouter = express_1.default.Router();
//@ts-ignore
signUpRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate the request body using zod
        const { success, data } = signupBody.safeParse(req.body);
        if (!success) {
            return res.status(400).json({
                message: "Invalid input data"
            });
        }
        const { email, password } = data;
        // Check if the user with the same email already exists
        const existingUser = yield prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            return res.status(409).json({
                message: "Email already taken"
            });
        }
        // Hash the password before storing it
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        // Create a new user in the database
        const user = yield prisma.user.create({
            data: {
                email: email,
                password: hashedPassword // Store hashed password
            }
        });
        const userId = user.id;
        // Generate a JWT token for the user
        const token = jsonwebtoken_1.default.sign({ userId: Number(user.id) }, JWT_SECRET, { expiresIn: '1h' });
        // Respond with the token and success message
        res.status(201).json({
            message: "User created successfully",
            token: token
        });
    }
    catch (error) {
        // Catch and return any errors
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}));
exports.default = signUpRouter;
