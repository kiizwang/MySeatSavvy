const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tableSchema = new Schema(
  {
    restaurant_id: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
    },
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
              // booked time slot
              type: String,
            },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Table", tableSchema);
