const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');

// GET complete Menu
router.get('/', async (req, res) => {
  try {
    const menu = await Menu.find();
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new Menu
router.post('/', async (req, res) => {
    console.log('req.body', req.body);
  const menu = new Menu(req.body);
  try {
    const newMenu = await menu.save();
    res.status(201).json(newMenu);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
