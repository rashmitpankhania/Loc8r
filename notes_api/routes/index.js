var express = require('express');
var router = express.Router();
var ctrlLocations = require('../controllers/locations');
var ctrlReviews = require('../controllers/reviews');

/* GET Loactions Pages */

router.get('/location', ctrlLocations.locationsListBydistance);
router.post('/location/add', ctrlLocations.locationCreate);
router.get('/location/:locationid', ctrlLocations.locationRead);
router.put('/location/:locationid', ctrlLocations.locationUpdate);
router.delete('/location/:locationid', ctrlLocations.locationDelete);

/* GET Review Page*/

router.post('/location/:locationid/reviews', ctrlReviews.reviewCreate);
router.get('/location/:locationid/reviews/:reviewid', ctrlReviews.reviewRead);
router.put('/location/:locationid/reviews/:reviewid', ctrlReviews.reviewUpdate);
router.delete('/location/:locationid/reviews/:reviewid', ctrlReviews.reviewDelete);


module.exports = router;