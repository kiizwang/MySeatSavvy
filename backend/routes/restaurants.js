const express = require("express");
const router = express.Router();
const Restaurant = require("../models/Restaurant");

// For creating restaurant data
// http://localhost:4000/restaurants/create-restaurant-1
router.get("/create-restaurant-1", async (req, res) => {
  const sampleRestaurantData = {
    name: "The Rich Uncle Tavern",
    type: "Gastro Pub, Canadian, Burgers",
    payments: "Credit Card, Mastercard, UnionPay via TheFork Pay, Visa",
    address: "45 King St W, Kitchener, ON N2G 1A1",
    location: { latitude: 43.389511, longitude: -80.404778 },
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
// http://localhost:4000/restaurants/create-restaurant-2
router.get("/create-restaurant-2", async (req, res) => {
  const sampleRestaurantData = {
    name: "Victoria's Restaurant",
    type: "Steakhouse, Steak, Seafood",
    payments: "AMEX, Mastercard, Visa",
    address: "31 Pioneer Tower Crescent, Kitchener, ON N2P 2L2",
    location: { latitude: 43.469761, longitude: -80.538811 },
    phone: "(520) 200-5555",
    description: [
      "Hamilton's Premier Steakhouse at the corner of Locke and King. Enjoy exquisite dining in a setting purposefully designed to highlight the character of its past. Superior quality craft Steaks, luxurious Japanese Wagyu and Seafood highlight the menu offerings with creative cocktails and carefully chosen wines, served with warm and genuine hospitality. Suitable for cocktails in the lounge, or a full dining experience with a private room available.",
    ],
    banner_image: "Victorias_Restaurant.jpg",
    days: [
      {
        day: "Sunday",
        status: "Open",
        hour_ranges: [{ start: "17:00", end: "22:00" }],
      },
      {
        day: "Monday",
        status: "Open",
        hour_ranges: [{ start: "17:00", end: "22:00" }],
      },
      {
        day: "Tuesday",
        status: "Open",
        hour_ranges: [{ start: "17:00", end: "22:00" }],
      },
      {
        day: "Wednesday",
        status: "Open",
        hour_ranges: [{ start: "17:00", end: "22:00" }],
      },
      {
        day: "Thursday",
        status: "Open",
        hour_ranges: [{ start: "17:00", end: "22:00" }],
      },
      {
        day: "Friday",
        status: "Open",
        hour_ranges: [{ start: "17:00", end: "22:30" }],
      },
      {
        day: "Saturday",
        status: "Open",
        hour_ranges: [{ start: "17:00", end: "22:30" }],
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
// http://localhost:4000/restaurants/create-restaurant-3
router.get("/create-restaurant-3", async (req, res) => {
  const sampleRestaurantData = {
    name: "Crowsfoot Smokehaus",
    type: "Pub, Brewery, Pizza Bar",
    payments: "AMEX, Mastercard, Visa",
    address: "223 Erb St. W, Waterloo, ON N2L 0B3",
    location: { latitude: 43.527481, longitude: -80.223099 },
    phone: "(500) 111-5252",
    description: [
      "Crowsfoot Restaurant is located in the small farming community of Conestogo, Ontario and stands on what is known to be one of the oldest venue sites in the region. Settled by Mennonites and German immigrants in the 1820s, the site has has a continued tradition of serving great food in a comfortable and welcoming atmosphere.",
      "Crowsfoot Restaurant will look to support the farmers in our surrounding region by offering a menu that combines the community's rich German culture with classic Southern-style Smokehouse barbecue.",
      "Crowsfoot does have its own on-site General Store, stocked with locally sourced products, produce, and everyday essentials.",
    ],
    banner_image: "Crowsfoot_Smokehaus.jpg",
    days: [
      {
        day: "Sunday",
        status: "Open",
        hour_ranges: [{ start: "11:00", end: "21:00" }],
      },
      {
        day: "Monday",
        status: "Open",
        hour_ranges: [{ start: "11:30", end: "21:00" }],
      },
      {
        day: "Tuesday",
        status: "Open",
        hour_ranges: [{ start: "11:30", end: "21:00" }],
      },
      {
        day: "Wednesday",
        status: "Open",
        hour_ranges: [{ start: "11:30", end: "21:00" }],
      },
      {
        day: "Thursday",
        status: "Open",
        hour_ranges: [{ start: "11:30", end: "21:00" }],
      },
      {
        day: "Friday",
        status: "Open",
        hour_ranges: [{ start: "11:30", end: "22:00" }],
      },
      {
        day: "Saturday",
        status: "Open",
        hour_ranges: [{ start: "11:30", end: "22:00" }],
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
// http://localhost:4000/restaurants/create-restaurant-4
router.get("/create-restaurant-4", async (req, res) => {
  const sampleRestaurantData = {
    name: "Dels Italian Kitchen",
    type: "Italian",
    payments: "AMEX, Mastercard, Visa",
    address: "340 Hagey Blvd, Waterloo, ON N2L 6R6",
    location: { latitude: 43.661369, longitude: -79.396263 },
    phone: "(425) 667-8267",
    description: [
      "We thank you for booking at Dels!",
      "Dels Italian Kitchen is a great choice for a casual night out with its vibrant setting, cozy patio, open kitchen and comfortable bar. Our Chefs approachable Italian kitchen cuisine is always prepared with the highest standards and freshest ingredients. We know you will appreciate the details that make dels special...pasta made from scratch, house made sauces, fresh baked flowerpot bread, hand stretched pizzas baked in our stone hearth pizza oven.",
      "Buon Appetito",
    ],
    banner_image: "Dels_Italian_Kitchen.jpg",
    days: [
      {
        day: "Sunday",
        status: "Open",
        hour_ranges: [{ start: "17:00", end: "22:00" }],
      },
      {
        day: "Monday",
        status: "Open",
        hour_ranges: [{ start: "17:00", end: "22:00" }],
      },
      {
        day: "Tuesday",
        status: "Open",
        hour_ranges: [{ start: "17:00", end: "22:00" }],
      },
      {
        day: "Wednesday",
        status: "Open",
        hour_ranges: [{ start: "17:00", end: "22:00" }],
      },
      {
        day: "Thursday",
        status: "Open",
        hour_ranges: [{ start: "17:00", end: "22:00" }],
      },
      {
        day: "Friday",
        status: "Open",
        hour_ranges: [{ start: "16:00", end: "23:00" }],
      },
      {
        day: "Saturday",
        status: "Open",
        hour_ranges: [{ start: "16:00", end: "23:00" }],
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
