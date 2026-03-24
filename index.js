import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import connectDB from './config/db.js';
import authRouter from './routes/auth.js';
import verificationRouter from './routes/verification.js';

dotenv.config();
const app = express();

// View engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

// Middleware
app.use(express.json());
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            'https://igniteverse.in',
            'http://localhost:3000',
            'http://localhost:5173'
        ];

        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('CORS not allowed'));
        }
    },
    credentials: true
}));

app.options(/.*/, cors());
connectDB();

app.get('/', (req, res) => {
    return res.render('index', { title: 'Auth-Routes', message: 'ES6 + EJS mode is live!' });
});

// API routes
app.use('/api/auth', authRouter);
app.use('/api/verification', verificationRouter);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));