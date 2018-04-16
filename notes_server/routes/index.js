var express = require('express');
var router = express.Router();
var ctrlLocations = require('../controllers/locations');
var ctrlOthers = require('../controllers/others');

/* GET Loactions Pages */

router.get('/location', ctrlLocations.locationInfo);
router.get('/location/addreview', ctrlLocations.addReview);
router.get('/', ctrlLocations.homelist);

/* GET Others Page*/
router.get('/about', ctrlOthers.about);
module.exports = router;
