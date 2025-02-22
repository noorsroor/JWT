/*----------------------------
---STEP 1: Import Libraries---
-----------------------------*/
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');

/*----------------------------
---STEP 2: Initialize App---
-----------------------------*/
const app = express();
const SECRET_KEY = 'noor123456';
const saltRounds = 10;
let users = [];
const PORT = 9000;

/*-----------------------------------
---STEP 3: Connect to front (CORS)---
------------------------------------*/
app.use(cors({
    origin: "http://localhost:5174", 
    credentials: true                 
}));

/*----------------------------
---STEP 4: Use Middleware------
-----------------------------*/
app.use(express.json());
app.use(cookieParser());

/*----------------------------
---STEP 5: Send Users List----
-----------------------------*/
app.get('/', (req, res) => {
    res.json(users);
});

/*----------------------------
---STEP 6: Signup Route----
-----------------------------*/
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password required' });
    }

    // ✅ Hash password before storing
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    users.push({ username, password: hashedPassword });

    return res.status(201).json({ message: "User successfully registered!" });
});

/*----------------------------
---STEP 7: Login Route----
-----------------------------*/
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find((user) => user.username === username);

    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ Generate JWT token
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

    // ✅ Store token in HTTP-only cookie
    res.cookie("authToken", token, { httpOnly: true, secure: false, maxAge: 36000000 });
    res.json({ message: "Login successful!" });
});

/*----------------------------------------
---STEP 8: Middleware for Authentication----
------------------------------------------*/
const authenticateToken = (req, res, next) => {
    const token = req.cookies.authToken;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" }); // ✅ Add return here
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

/*----------------------------
---STEP 9: Protected Profile Page----
-----------------------------*/
app.get('/profile', authenticateToken, (req, res) => {
    res.json({ message: `Welcome ${req.user.username}, this is your profile page!` });
});

/*----------------------------
---STEP 10: Start Server----
-----------------------------*/
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
