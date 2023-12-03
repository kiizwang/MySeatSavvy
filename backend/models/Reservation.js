const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reservationSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      trim: true,
    },
    time: {
      type: String,
      trim: true,
    },
    guests: {
      type: Number,
      required: true,
    },
    restaurant_id: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
    },
    table_id: {
      type: Schema.Types.ObjectId,
      ref: "Table",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Reservation", reservationSchema);
