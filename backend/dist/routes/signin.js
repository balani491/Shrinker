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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = __importDefault(require("zod"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
const prisma = new client_1.PrismaClient();
const signinBody = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string(),
});
const SignInRouter = express_1.default.Router();
//@ts-ignore
SignInRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = signinBody.parse(req.body);
        const user = yield prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!user || !user.password || !(yield bcryptjs_1.default.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        // console.log(user.id)
        // console.log(typeof user.id)
        const token = jsonwebtoken_1.default.sign({ userId: Number(user.id) }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}));
exports.default = SignInRouter;
