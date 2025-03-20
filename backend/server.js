// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import cors from "cors";

// dotenv.config();
// const app = express();

// app.use(cors({
//   origin: "http://localhost:5178",
//   credentials: true,
// }));
// app.use(express.json());

// // MongoDB Connection
// mongoose.connect(process.env.MONGO_URI, { dbName: 'cphub' }) // <-- Ensure dbName is correct here!
//     .then(() => console.log('✅ MongoDB Connected!'))
//     .catch(err => console.log('❌ MongoDB Connection Error: ', err));

// // User Schema & Model
// const userSchema = new mongoose.Schema({
//     uid: { type: String, required: true, unique: true },
//     email: { type: String, required: true },
//     displayName: { type: String },
//     photoURL: { type: String },
//   });

// const User = mongoose.model("User", userSchema);

// // Google Auth API route
// app.post('/api/auth/google', async (req, res) => {
//     try {
//         console.log("➡️ Request received on /api/auth/google");
//         console.log("📦 Request body:", req.body);

//         const { uid, email, displayName, photoURL } = req.body;

//         if (!uid || !email) {
//             return res.status(400).json({ message: 'Missing uid or email' });
//         }

//         const existingUser = await User.findOne({ uid });
//         if (!existingUser) {
//             const newUser = await User.create({ uid, email, displayName, photoURL });
//             console.log("✅ User saved to DB:", newUser);
//         } else {
//             console.log("ℹ️ User already exists:", existingUser);
//         }

//         res.status(200).json({ message: 'User processed successfully!' });
//     } catch (err) {
//         console.error("❌ Error saving user:", err);
//         res.status(500).json({ message: 'Error saving user' });
//     }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bookmarkRoutes from './routes/Bookmark.js'; // Pick one consistent route file

dotenv.config();

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.log(err));

// Routes
app.use('/api/bookmarks', bookmarkRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
