const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

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