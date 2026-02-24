import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import activityRoutes from './routes/activityRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
// delegate connection logic to our helper so we can centralise options
// and error handling.  The helper reads `process.env.MONGO_URI`.
connectDB();

// Routes
app.use('/api', activityRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});