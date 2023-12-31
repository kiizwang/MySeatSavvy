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

const locationSchema = new Schema({
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
});

const menuItemSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
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
    location: locationSchema,
    phone: {
      type: String,
      required: true,
    },
    description: {
      type: [String],
      required: true,
    },
    banner_image: {
      type: String,
      required: true,
    },
    menu: [menuItemSchema],
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
        hour_ranges: [timeSlotSchema],
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
