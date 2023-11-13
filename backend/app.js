// Require the packages
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const cors = require("cors"); // for frontend proxy
const PORT = 4000;

// Importing routes
const customerRouter = require('./routes/customers');
const restaurantRouter = require('./routes/restaurants');
const menuRouter = require('./routes/menu');
const reservationsRouter = require('./routes/reservations');
const tableRouter = require('./routes/tables');

// Connect to MongoDB
// mongoose.connect('mongodb+srv://seatsavvy:A6otj4M@cluster0.8vmqele.mongodb.net/seatsavvy-db?retryWrites=true&w=majority');
mongoose.connect("mongodb+srv://admin:admin@cluster0.zhseqff.mongodb.net/seatsavvy?retryWrites=true&w=majority");

mongoose.connection.on('error', (error) => console.error('MongoDB connection error:', error));
mongoose.connection.once('open', () => console.log('Connected to MongoDB'));

// Middleware
app.use(bodyParser.json());
app.use(cors()); // for frontend proxy

// Routes
app.get('/', (req, res) => res.send('Welcome to the SeatSavvy Backend!!!'));

// Use the routes
app.use('/customers', customerRouter);
app.use('/restaurants', restaurantRouter);
app.use('/menus', menuRouter);
app.use('/reservations', reservationsRouter);
app.use('/tables', tableRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
