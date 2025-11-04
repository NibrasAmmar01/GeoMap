const express = require('express');
const { addName, mapInfo, addMap, getAllMaps, deleteMap, editMap, getGeoMapInfo } = require('../controllers/mapController');
const router = express.Router();


router.post('/addName', addName)
router.post("/getMapInfo", mapInfo)
router.post("/addMap", addMap)
router.post("/getAllMaps", getAllMaps)
router.post("/deleteMap", deleteMap);
router.post("/editMap", editMap);
router.post("/allGeoInfo", getGeoMapInfo);


module.exports = router