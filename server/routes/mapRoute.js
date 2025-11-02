const express = require('express');
const { addName, mapInfo, addMap, getAllMaps } = require('../controllers/mapController');
const router = express.Router();


router.post('/addName', addName)
router.post("/getMapInfo", mapInfo)
router.post("/addMap", addMap)
router.post("/getAllMaps", getAllMaps)

module.exports = router