const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const timeSlotSchema = new Schema({
  start: {
    type: String,
    required: true,
  },
  end: {
    type: String,
    required: true,
  },
});

const restaurantSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    payments: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    description: {
      type: [String],
      required: true,
    },
    days: [
      {
        day: {
          type: String,
          required: true,
          enum: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        },
        status: {
          type: String,
          enum: ["Open", "Closed"],
          required: true,
        },
        time_slots: [timeSlotSchema],
      },
    ],
    max_party_size: {
      type: Number,
      required: true,
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

module.exports = mongoose.model("Restaurant", restaurantSchema);
