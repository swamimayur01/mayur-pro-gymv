const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

// 1. MIDDLEWARE
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // This serves your login.html, profile.html, etc.

// 2. MONGODB CONNECTION (Replace with your Atlas String)
// You must create a free cluster at mongodb.com to get this string.
const mongoURI = "mongodb+srv://admin:yourpassword@cluster0.mongodb.net/mayurPro?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
    .then(() => console.log("🚀 System Connected to Cloud Database"))
    .catch(err => console.error("❌ Database Connection Error:", err));

// 3. USER SCHEMA
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// 4. API ROUTES

// Login Route
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username, password });
        if (user) {
            res.status(200).json({ success: true, message: "Login Successful" });
        } else {
            res.status(401).json({ success: false, message: "Invalid Credentials" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// Registration Route (Optional, for new users)
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const newUser = new User({ username, password });
        await newUser.save();
        res.status(201).json({ success: true, message: "User Registered" });
    } catch (error) {
        res.status(400).json({ success: false, message: "Username already exists" });
    }
});

// 5. SERVING THE FRONT-END
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// 6. DYNAMIC PORT FOR HOSTING
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`MAYUR PRO OS is active on Port ${PORT}`);
});