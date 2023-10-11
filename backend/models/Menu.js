const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const menuSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  price:  { type: String, required: true },
  ratings: { type: String, required: true }
});

// Link the Schema with the collection
const Menu = mongoose.model('Menu', menuSchema); 

module.exports = Menu;