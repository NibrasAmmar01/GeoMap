const express = require('express');
const { addName, mapInfo, addMap, getAllMaps, deleteMap, editMap } = require('../controllers/mapController');
const router = express.Router();


router.post('/addName', addName)
router.post("/getMapInfo", mapInfo)
router.post("/addMap", addMap)
router.post("/getAllMaps", getAllMaps)
router.post("/deleteMap", deleteMap);
router.post("/editMap", editMap);


module.exports = router