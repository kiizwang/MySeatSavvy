const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

// For creating restaurant data
// http://localhost:4000/restaurants/create-sample
router.get('/create-sample', async (req, res) => {
    const sampleData = {
      name: "The Rich Uncle Tavern",
      type: "Type A",
      payments: "Payments",
      address: "Address A",
      phone: "111-222-3333",
      description: "Description",
      party_max_size: 8,
      table_id: null,
    };
    try {
        const newRestaurant = new Restaurant(sampleData);
        const savedRestaurant = await newRestaurant.save();
        res.json(savedRestaurant);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET all restaurants
router.get('/', async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new restaurant
router.post('/', async (req, res) => {
    console.log('req.body', req.body);
  const restaurant = new Restaurant(req.body);
  try {
    const newRestaurant = await restaurant.save();
    res.status(201).json(newRestaurant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
