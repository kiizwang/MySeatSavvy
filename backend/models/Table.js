const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tableSchema = new mongoose.Schema({
  number:  { type: String, required: true },
  availibity:  { type: String, required: true },
  capacity: { type: String, required: true }
});

// Link the Schema with the collection
const Table = mongoose.model('Table', tableSchema); 

module.exports = Table;
