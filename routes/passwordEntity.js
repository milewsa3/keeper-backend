const express = require('express');
const router = express.Router();
const db = require('../config/database');
const PasswordEntity = require('../models/PasswordEntity');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// Get all PasswordEntities
router.get('/', (req, res) =>
  PasswordEntity.findAll()
  .then(result => res.json(result))
  .catch(err => res.status(400).json('Error: ' + err)))

// Add a PasswordEntity
router.post('/', (req, res) => {
  let { page_url, password } = req.body;
  let errors = [];

  // Validate Fields
  if(!page_url) {
    errors.push({ text: 'Please add a page url' });
  }
  if(!password) {
    errors.push({ text: 'Please add password' });
  }

  // Check for errors
  if(errors.length > 0) {
    res.status(400).json(JSON.stringify(errors))
    return
  }

  PasswordEntity.create({
    page_url,
    password,
  })
  .then(result => res.json(result))
  .catch(err => res.status(400).json('Error: ' + err))
});

module.exports = router;