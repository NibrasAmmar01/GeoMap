const express = require('express');
const { addName } = require('../controllers/mapController');
const router = express.Router();


router.post('/addName', addName)

module.exports = router