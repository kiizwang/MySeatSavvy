const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tableSchema = new Schema(
  {
    table_name: {
      type: String,
      required: true,
    },
    max_capacity: {
      type: Number,
      required: true,
    },
    booked_date_time: {
      booked_date: {
        type: Date,
      },
      booked_time: [{ type: String }],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Table", tableSchema);