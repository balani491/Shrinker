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
const cors_1 = __importDefault(require("cors"));
const index_1 = __importDefault(require("./routes/index"));
const client_1 = require("@prisma/client");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/v1", index_1.default);
const prisma = new client_1.PrismaClient();
//@ts-ignore
app.get('/:shortUrl', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { shortUrl } = req.params;
    try {
        const urlEntry = yield prisma.url.findUnique({
            where: { shortUrl },
        });
        if (urlEntry) {
            yield prisma.url.update({
                where: { shortUrl },
                data: { visits: { increment: 1 } },
            });
            const originalUrl = urlEntry.originalUrl;
            const fullUrl = originalUrl.startsWith('http://') || originalUrl.startsWith('https://')
                ? originalUrl
                : `http://${originalUrl}`;
            // Redirect to the original URL
            return res.redirect(fullUrl);
        }
        else {
            return res.status(404).json({ message: "Short URL not found" });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
