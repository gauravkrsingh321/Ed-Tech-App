const express = require('express');
require("dotenv").config(); // Load environment variables from .env file
const connectToDB = require('./config/db');

// Initialize Express app   
const app = express();  

// Define a port
const PORT = process.env.PORT || 4000;

app.use(express.json());

// Connect to MongoDB   
connectToDB();

// Basic route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});