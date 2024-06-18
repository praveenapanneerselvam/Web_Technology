const http = require('http');
const url = require('url');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection URI
const uri = 'mongodb://localhost:27017/';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

connectDB();

app.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const database = client.db('appointment');
        const collection = database.collection('signup');

        // Check if the user already exists
        const existingUser = await collection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Insert the new user
        await collection.insertOne({ email, password });
        res.status(201).json({ message: 'Signup successful' });
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const database = client.db('appointment');
        const collection = database.collection('signup');

        // Check if the user exists and the password matches
        const user = await collection.findOne({ email, password });
        if (user) {
            res.status(200).json({ success: true, message: 'Login successful' });
        } else {
            res.status(400).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

const server = http.createServer(app);
server.listen(9050, () => {
    console.log('Server is listening on port 9050');
});
