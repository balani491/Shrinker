import dotenv from 'dotenv';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET!;
import jwt from "jsonwebtoken";

//@ts-ignore
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // console.log("No header");
        return res.status(403).json({"message": "Invalid token"});
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        //@ts-ignore
        req.userId = decoded.userId;
        //@ts-ignore
        next();
    } catch (err) {
        // console.log("erro")
        return res.status(403).json({
            
            message: "Invalid token"
        });
    }
};

export default authMiddleware;