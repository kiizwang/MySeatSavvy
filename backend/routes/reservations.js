const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");
const Table = require("../models/Table");

// GET all reservations
router.get("/", async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a specific reservation by ID
router.get("/:reservationId", async (req, res) => {
  const reservationId = req.params.reservationId;

  try {
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    // Retrieve table name based on the table_id
    const table = await Table.findOne({ _id: reservation.table_id });

    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }
    const { table_name } = table;

    // Append table_name to the reservation object
    const reservationWithTableName = { ...reservation.toObject(), table_name };

    res.json(reservationWithTableName);
  } catch (err) {
    console.error("Error fetching reservation:", err);
    res.status(500).json({ message: "Error fetching reservation" });
  }
});

// POST a new reservation
router.post("/", async (req, res) => {
  const reservation = new Reservation(req.body);
  try {
    const newReservation = await reservation.save();
    res.status(201).json(newReservation);
  } catch (err) {
    console.log("error message: ", err.message);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
