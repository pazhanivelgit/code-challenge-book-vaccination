var express = require('express');
var router = express.Router();
var db = require('../config/queries');

router.post('/appointment', db.createAppointment);

router.post('/setupcenter', db.setupCenter);

router.get('/centers', db.getCenters);

module.exports = router;