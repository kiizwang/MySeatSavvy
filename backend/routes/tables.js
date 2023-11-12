const express = require('express');
const router = express.Router();
const Table = require('../models/Table');
const mongoose = require("mongoose");

// For creating table data
// http://localhost:4000/tables/create-table-sample
router.get("/create-table-sample", async (req, res) => {
  const sampleTablesData = [
    {
      table_name: "A1",
      max_table_capacity: 4,
      booked_date_time: [
        {
          booked_date: new Date("2023-11-13"),
          booked_time_slots: ["11:00", "12:00"],
        },
      ],
      restaurant_id: new mongoose.Types.ObjectId("654b0220c92939bf72348ab0"),
      reservation_id: null,
    },
    {
      table_name: "A2",
      max_table_capacity: 8,
      booked_date_time: [
        {
          booked_date: new Date("2023-11-13"),
          booked_time_slots: ["11:00", "12:00"],
        },
      ],
      restaurant_id: new mongoose.Types.ObjectId("654b0220c92939bf72348ab0"),
      reservation_id: null,
    },
    {
      table_name: "A3",
      max_table_capacity: 4,
      booked_date_time: [
        {
          booked_date: new Date("2023-11-13"),
          booked_time_slots: ["11:00"],
        },
      ],
      restaurant_id: new mongoose.Types.ObjectId("654b0220c92939bf72348ab0"),
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
