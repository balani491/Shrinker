import express from 'express';
import signUpRouter from "./signup";
import signInRouter from "./signin";
import getShrinkerRouter from "./getshrinker";
import authMiddleware from '../middleware/verify';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.use("/signup", signUpRouter);
router.use("/signin", signInRouter);
router.use("/getshrinker", getShrinkerRouter);




export default router;
