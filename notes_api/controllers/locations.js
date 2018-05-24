var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = function (res, status, content) {
	res.status(status);
	res.set({ 'Content-Type': 'application/json; charset=utf-8', 'title': 'Rash' }).status(200).send(JSON.stringify(content, undefined, '\t'));
};

var theEarth = (function () {
	var ras;
	var earthRad = 6371; //km
	var getDistanceFromRads = function (rads) {
		return parseFloat(rads * earthRad);
	};
	var getRadsFromDistance = function (distance) {
		return parseFloat(distance / earthRad);
	};
	return {
		getDistanceFromRads: getDistanceFromRads,
		getRadsFromDistance: getRadsFromDistance
	};
})();


/* we will filter a list in which nearest locarions list will be given
we will be using geoNear method in Loc
geoNear needs three parameters geojson point, options and a callback */
module.exports.locationsListBydistance = function (req, res) {
	var lng = parseFloat(req.query.lng);
	var lat = parseFloat(req.query.lat);
	if (!lng || !lat) {
		sendJsonResponse(res, 404, {
			'message': 'latitude longitude both are required'
		});
		return;
	}
	Loc.aggregate(
		[{
			$geoNear: {
				'near': { 'type': 'Point', 'coordinates': [lng, lat] },
				'spherical': true,
				'maxdistance': theEarth.getRadsFromDistance(20),
				'num': 10,
				'distanceField': 'dist'
			}
		}
		], function (err, results) {
			var locations = [];
			results.forEach(function (doc) {
				locations.push({
					distance: theEarth.getDistanceFromRads(doc.dist),
					name: doc.name,
					address: doc.address,
					facilities: doc.facilities,
					rating: doc.rating,
					_id: doc._id
				});
			});
			sendJsonResponse(res, 200, locations);
		});
};

module.exports.locationCreate = function (req, res) {
	Loc.create({
		name: req.body.name,
		address: req.body.address,
		rating: req.body.rating,
		facilties: req.body.facilities.split(","),
		coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
		openingTimes: [
			{
				days: req.body.day1,
				opening: req.body.opening1,
				closing: req.body.closing1,
				closed: req.body.closed1,
			},
			{
				days: req.body.day2,
				opening: req.body.opening2,
				closing: req.body.closing2,
				closed: req.body.closed2,
			}
		]
	}, function (err, location) {
		if (err) {
			sendJsonResponse(res, 400, err);
		} else {
			sendJsonResponse(res, 201, location);
		}
	});

};

module.exports.locationRead = function (req, res) {
	if (req.params && req.params.locationid) {
		Loc.findById(req.params.locationid).exec(function (err, location) {
			if (!location) {
				sendJsonResponse(res, 404, {
					'message': 'incorrect location id'
				})
				return;
			} else if (err) {
				sendJsonResponse(res, 404, err);
				return;
			}
			sendJsonResponse(res, 200, location);
		})
	} else {
		sendJsonResponse(res, 404, {
			'message': 'not inserted the locationid'
		})
	}

};

module.exports.locationUpdate = function (req, res) {
	var locationid = req.params.locationid;
	if (!locationid) {
		sendJsonResponse(res, 404, {
			message: 'sorry location id is required'
		})
	} else {
		Loc
			.findById(locationid)
			.select('-reviews -rating')
			.exec(function (err, location) {
				if (!location) {
					sendJsonResponse(res, 404, {
						message: 'wth the id is rong!!!'
					})
				} else if (err) {
					sendJsonResponse(res, 403, err)
				} else {
					location.name = req.body.name;
					location.address = req.body.address;
					location.facilities = req.body.facilities.split(',');
					location.coordinates = [parseFloat(req.body.lng), parseFloat(req.body.lat)];
					location.openingTimes = [
						{
							days: req.body.days1,
							opening: req.body.opening1,
							closing: req.body.closing1,
							closed: req.body.closed1
						},
						{
							days: req.body.days2,
							opening: req.body.opening2,
							closing: req.body.closing2,
							closed: req.body.closed2
						}
					];
					location.save(function (err, location) {
						if (err) {							
							sendJsonResponse(res, 403, err);
						} else {
							sendJsonResponse(res, 200, location);
						}
					});
				}
			});

	};

};

module.exports.locationDelete = function (req, res) {
	var locationid = req.params.locationid;
	if (!locationid) {
		sendJsonResponse(res, 404, {
			message: 'beta delete karne keliye id to bol!!'
		});
	} else {
		Loc
			.findByIdAndRemove(locationid)
			.exec(function(err, location){
				if(err){
					sendJsonResponse(res, 404, err);
				} else {
					sendJsonResponse(res, 204, null);
				}
			});
	}
};
