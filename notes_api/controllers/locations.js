var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = function (res, status, content) {
	res.status(status);
	res.set({'Content-Type': 'application/json; charset=utf-8','title': 'Rash'}).status(200).send(JSON.stringify(content, undefined, '\t'));
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


// we will filter a list in which nearest locarions list will be given
// we will be using geoNear method in Loc
// geoNear needs three parameters geojson point, options and a callback 
module.exports.locationsListBydistance = function (req, res) {
	var lng = parseFloat(req.query.lng);
	var lat = parseFloat(req.query.lat);
	if(!lng || !lat) {
		sendJsonResponse(res, 404, {
			'message': 'latitude longitude both are required';
		});
		return;
	}
	Loc.aggregate(
		[{
			$geoNear: {
				'near': {'type':'Point', 'coordinates':[lng, lat]},
				'spherical': true,
				'maxdistance': theEarth.getRadsFromDistance(20),
				'num':10,
				'distanceField': 'dist' 
			}
		}
		], function(err, results) {
			var locations = [];
			console.log(results);
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
	
};
module.exports.locationRead = function (req, res) {
	if(req.params && req.params.locationid) {
		Loc.findById(req.params.locationid).exec(function (err, location) {
			if(!location){
				sendJsonResponse(res, 404, {
					'message': 'incorrect location id'
				})
				return;
			} else if(err) {
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
	
};
module.exports.locationDelete =  function (req, res) { 
	
};