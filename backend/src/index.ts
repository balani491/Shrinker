import express from 'express';
import cors from "cors";
import rootRouter from "./routes/index";
import { PrismaClient } from '@prisma/client';

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1", rootRouter);


const prisma = new PrismaClient();

//@ts-ignore
app.get('/:shortUrl', async (req, res) => {
    const { shortUrl } = req.params; 

    try {
        
        const urlEntry = await prisma.url.findUnique({
            where: { shortUrl },
        });

        if (urlEntry) {
            await prisma.url.update({
                where: { shortUrl },
                data: { visits: { increment: 1 } },
            })
            const originalUrl = urlEntry.originalUrl;

           
            const fullUrl = originalUrl.startsWith('http://') || originalUrl.startsWith('https://') 
                ? originalUrl
                : `http://${originalUrl}`; 

            // Redirect to the original URL
            return res.redirect(fullUrl);
        } else {
            
            return res.status(404).json({ message: "Short URL not found" });
        }
    } catch (error) {
        
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
