import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

dotenv.config();

const app = express();

app.use(cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// app.use("/api/players", playerRoutes);


const PORT = process.env.PORT || 8000;

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "frontend", "dist", "index.html")));

    app.get("/*path", (req, res) => {
        res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;