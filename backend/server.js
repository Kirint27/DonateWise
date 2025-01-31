const express = require('express');  // Importing express
const app = require('./app'); // Import the app
const charityNameTable = require('./db/tables/charityName'); // Add this line


const PORT = process.env.PORT || 3001; // Use PORT environment variable if available, or default to 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

});