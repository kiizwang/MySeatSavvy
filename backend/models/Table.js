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
    booked_date_time: [
      {
        booked_date: {
          // booked date
          type: Date,
        },
        booked_time_slots: [
          {
            booked_time: {
              // array of booked time slot
              type: String,
            },
          },
        ],
      },
    ],
    restaurant_id: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
    },
    reservation_id: {
      type: Schema.Types.ObjectId,
      ref: "Reservation",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Table", tableSchema);
