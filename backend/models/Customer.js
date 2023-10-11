const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new mongoose.Schema({
  firstname:  { type: String, required: true },
  lastname:  { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true }
});

// Link the Schema with the collection
const Customer = mongoose.model('Customer', customerSchema); 

module.exports = Customer;
