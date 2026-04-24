const express = require('express');
const cors = require('cors');
const bfhlRouter = require('./routes/bfhl');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins
app.use(cors());

// Use express.json() middleware to parse JSON bodies
app.use(express.json());

// Mount the bfhl router at /bfhl
app.use('/bfhl', bfhlRouter);

// Basic health check endpoint
app.get('/', (req, res) => {
    res.send('SRM-BFHL API is operational');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
