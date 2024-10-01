import express from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import zod from 'zod';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs'; 

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET!;

const prisma = new PrismaClient();


const signinBody = zod.object({
  email: zod.string().email(), 
  password: zod.string(),
});

const SignInRouter = express.Router();
//@ts-ignore
SignInRouter.post('/', async (req, res) => {
  try {
    
    const { email, password } = signinBody.parse(req.body);
    
    const user = await prisma.user.findUnique({
      where: {
        email: email, 
      },
    });

    if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    // console.log(user.id)
    // console.log(typeof user.id)
    
    const token = jwt.sign({ userId: Number(user.id) }, JWT_SECRET!, { expiresIn: '1h' });

   
    res.json({ token });
  } catch (error: any) {
    
    res.status(400).json({ message: error.message });
  }
});

export default SignInRouter;
