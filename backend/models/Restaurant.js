const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const restaurantSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  address:  { type: String, required: true },
  phone: { type: String, required: true },
  description: { type: String },
  working_hours: { type: String},
  menu: { type: String, required: true },
  number_of_tables: { type: String, required: true }
});

// Link the Schema with the collection
const Restaurant = mongoose.model('Restaurant', restaurantSchema); 

module.exports = Restaurant;