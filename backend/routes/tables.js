const express = require('express');
const router = express.Router();
const Table = require('../models/Table');
const mongoose = require("mongoose");
const moment = require("moment-timezone");

// Create table sample
// http://localhost:4000/tables/table-sample-create
router.get("/table-sample-create", async (req, res) => {
  const torontoTimeZone = "America/Toronto";

  const sampleTablesData = [
    {
      table_name: "A1",
      table_capacity: {
        min: 1,
        max: 4,
      },
      booked_date_time: [
        {
          booked_date: moment.tz("2023-11-13", torontoTimeZone),
          booked_time_slots: ["11:00", "12:00"],
        },
      ],
      restaurant_id: new mongoose.Types.ObjectId("65511ae91afd8462ae0877a2"),
      reservation_id: null,
    },
    {
      table_name: "A2",
      table_capacity: {
        min: 5,
        max: 8,
      },
      booked_date_time: [
        {
          booked_date: moment.tz("2023-11-13", torontoTimeZone),
          booked_time_slots: ["11:00", "12:00", "13:00"],
        },
      ],
      restaurant_id: new mongoose.Types.ObjectId("65511ae91afd8462ae0877a2"),
      reservation_id: null,
    },
    {
      table_name: "A3",
      table_capacity: {
        min: 1,
        max: 4,
      },
      booked_date_time: [
        {
          booked_date: moment.tz("2023-11-13", torontoTimeZone),
          booked_time_slots: ["11:00", "12:00", "13:00", "14:00", "17:30", "18:30", "19:30", "20:30", "21:30"],
        },
      ],
      restaurant_id: new mongoose.Types.ObjectId("65511ae91afd8462ae0877a2"),
      reservation_id: null,
    },
  ];

  try {
    const savedTables = await Table.insertMany(sampleTablesData);
    res.json(savedTables);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE table sample
// http://localhost:4000/tables/table-sample-delete
router.get("/table-sample-delete", async (req, res) => {
  try {
    await Table.deleteMany({});
    res.json({ message: "All tables deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all tables with restaurant details
router.get('/', async (req, res) => {
  try {
    const tables = await Table.find().populate("restaurant_id");
    console.log(tables);
    res.json(tables);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new table
router.post('/', async (req, res) => {
    console.log('req.body', req.body);
  const table = new Table(req.body);
  try {
    const newTable = await table.save();
    res.status(201).json(newTable);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
