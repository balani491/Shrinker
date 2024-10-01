"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const signup_1 = __importDefault(require("./signup"));
const signin_1 = __importDefault(require("./signin"));
const getshrinker_1 = __importDefault(require("./getshrinker"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.use("/signup", signup_1.default);
router.use("/signin", signin_1.default);
router.use("/getshrinker", getshrinker_1.default);
// Get the original URL by the short URL
//@ts-ignore
exports.default = router;
