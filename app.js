const express = require('express');
const path = require('path');
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getDatabase, ref, push, get, update, remove } = require('firebase-admin/database');
const cookieParser = require('cookie-parser');

const app = express();

// Initialize Firebase Admin SDK
initializeApp({
    credential: applicationDefault(),
    databaseURL: "https://list-app-519dc-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const auth = getAuth();
const db = getDatabase();

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser()); // To handle cookies (for user sessions)

// Routes
app.get('/', async (req, res) => {
    const userToken = req.cookies.token;
    if (userToken) {
        try {
            const decodedToken = await auth.verifyIdToken(userToken);
            res.sendFile(path.join(__dirname, 'public', 'index.html'));
        } catch (error) {
            res.redirect('/login');
        }
    } else {
        res.redirect('/login');
    }
});

app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'public', 'register.html')));

// Firebase CRUD operations
// Add Data (Create)
app.post('/add-data', async (req, res) => {
    try {
        const data = req.body;
        const dbRef = ref(db, 'wishlist');
        await push(dbRef, data);
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error adding data: ' + error.message);
    }
});

// Get Data (Read)
app.get('/data', async (req, res) => {
    try {
        const dbRef = ref(db, 'wishlist');
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            res.json(snapshot.val());
        } else {
            res.status(404).send('No data found');
        }
    } catch (error) {
        res.status(500).send('Error fetching data: ' + error.message);
    }
});

// Update Data (Update)
app.post('/update-data/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const dbRef = ref(db, `wishlist/${id}`);
        await update(dbRef, updatedData);
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error updating data: ' + error.message);
    }
});

// Delete Data (Delete)
app.post('/delete-data/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const dbRef = ref(db, `wishlist/${id}`);
        await remove(dbRef);
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error deleting data: ' + error.message);
    }
});

// Firebase Authentication Routes
// Register User
app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const userRecord = await auth.createUser({
            email,
            password
        });
        console.log('User created:', userRecord.uid);
        res.redirect('/login');
    } catch (error) {
        res.status(400).send('Registration Failed: ' + error.message);
    }
});

// Login User
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await auth.getUserByEmail(email);
        const userToken = await auth.createCustomToken(user.uid);
        res.cookie('token', userToken, { httpOnly: true });
        res.redirect('/');
    } catch (error) {
        res.status(400).send('Login Failed: ' + error.message);
    }
});

// Logout User
app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
