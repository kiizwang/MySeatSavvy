const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

// For creating restaurant data
// http://localhost:4000/restaurants/create-restaurant-sample
router.get('/create-restaurant-sample', async (req, res) => {
    const sampleRestaurantData = {
      name: "The Rich Uncle Tavern",
      type: "Gastro Pub, Canadian, Burgers",
      payments: "Credit Card, Mastercard, UnionPay via TheFork Pay, Visa",
      address: "45 King St W, Kitchener, ON N2G 1A1",
      phone: "(519) 208-8555",
      description: [
        "With a unique, inventive menu, The Rich Uncle Tavern is built on hearty live-fire fare and shareable snacks that pay homage to the brasseries and taverns of yesteryear. Defined by our humble and wholesome approach to food and beverage, The Rich Uncle Tavern features a charming and homely ambience for patrons to gather with old friends and find some new ones.",
        "Whether you’re partaking in a crafted cocktail during live music or a late-night bite in one of our booths, you’ll be able to experience a sociable atmosphere, curated beverages and delicious fare that will leave you sated.",
      ],
      banner_image: "The_Rich_Uncle_Tavern.jpg",
      days: [
        {
          day: "Sunday",
          status: "Open",
          hour_ranges: [
            { start: "11:00", end: "15:00" },
            { start: "17:30", end: "22:30" },
          ],
        },
        {
          day: "Monday",
          status: "Open",
          hour_ranges: [
            { start: "11:00", end: "15:00" },
            { start: "17:30", end: "22:30" },
          ],
        },
        {
          day: "Tuesday",
          status: "Closed",
          hour_ranges: [],
        },
        {
          day: "Wednesday",
          status: "Closed",
          hour_ranges: [],
        },
        {
          day: "Thursday",
          status: "Open",
          hour_ranges: [
            { start: "11:00", end: "15:00" },
            { start: "17:30", end: "22:30" },
          ],
        },
        {
          day: "Friday",
          status: "Open",
          hour_ranges: [
            { start: "11:00", end: "15:00" },
            { start: "17:30", end: "22:30" },
          ],
        },
        {
          day: "Saturday",
          status: "Open",
          hour_ranges: [
            { start: "11:00", end: "15:00" },
            { start: "17:30", end: "22:30" },
          ],
        },
      ],
      max_party_size: 8,
      table_id: null,
    };
    try {
        const newRestaurant = new Restaurant(sampleRestaurantData);
        const savedRestaurant = await newRestaurant.save();
        res.json(savedRestaurant);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET all restaurants
router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new restaurant
router.post("/", async (req, res) => {
  console.log("req.body", req.body);
  const restaurant = new Restaurant(req.body);
  try {
    const newRestaurant = await restaurant.save();
    res.status(201).json(newRestaurant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
