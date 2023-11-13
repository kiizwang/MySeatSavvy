const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tableSchema = new Schema(
  {
    table_name: {
      type: String,
      required: true,
    },
    table_capacity: {
      min: {
        type: Number,
        required: true,
      },
      max: {
        type: Number,
        required: true,
      },
    },
    booked_date_time: [
      // array of booked date and time slots
      {
        booked_date: {
          // booked date
          type: Date,
        },
        booked_time_slots: [
          // array of booked time slots
          {
            type: String,
          },
        ],
      },
    ],
    restaurant_id: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
    },
    reservation_id: {
      type: [Schema.Types.ObjectId],
      ref: "Reservation",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Table", tableSchema);
