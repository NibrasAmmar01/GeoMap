const express = require('express');
const { addName, mapInfo } = require('../controllers/mapController');
const router = express.Router();


router.post('/addName', addName)
router.post("/getMapInfo", mapInfo)

module.exports = router