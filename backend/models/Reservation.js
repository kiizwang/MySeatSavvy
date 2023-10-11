const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reservationSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  address:  { type: String, required: true },
  phone: { type: String, required: true },
  description: { type: String },
  working_hours: { type: String},
  menu: { type: String, required: true },
  number_of_tables: { type: String, required: true }
});

// Link the Schema with the collection
const Reservation = mongoose.model('Reservation', reservationSchema); 

module.exports = Reservation;