const http = require('http');
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

app.post('/submitContact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    try {
        const database = client.db('appointment');
        const collection = database.collection('contact');

        // Insert the contact message
        await collection.insertOne({ name, email, message, createdAt: new Date() });
        res.status(201).json({ message: 'Thank you for your message!' });
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

const server = http.createServer(app);
const PORT = 5050;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
