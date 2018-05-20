var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = function (res, status, content) {
	res.status(status);
	res.set({ 'Content-Type': 'application/json; charset=utf-8' }).status(200).send(JSON.stringify(content, undefined, '\t'));
};

module.exports.reviewCreate = function (req, res) {

};
module.exports.reviewRead = function (req, res) {
	if (req.params && req.params.locationid && req.params.reviewid) {
		Loc
			.findById(req.params.locationid)
			.exec(
				function (err, location) {
					var response, review;
					if (!location) {
						sendJsonResponse(res, 404, {
							'message': 'Dude thats not here'
						});
						return;
					} else if (err) {
						sendJsonResponse(res, 404, err);
						return;
					}
					if (location.reviews && location.reviews.length > 0) {
						review = location.reviews.id(req.params.reviewid);
						console.log(review)
						if (!review) {
							sendJsonResponse(res, 404, {
								'message': 'wth reviewid not found'
							});
						} else {
							response = {
								location: {
									name: location.name,
								},
								review: review
							};
							sendJsonResponse(res, 200, response);
						}
					} else {
						sendJsonResponse(res, 404, {
							'message': 'review not found'
						});
					}
				});
	}
	else {
		sendJsonResponse(res, 404, { 'message': 'Dude i  know don\'t be smart.. no id in request' })
	}

};
module.exports.reviewUpdate = function (req, res) {

};
module.exports.reviewDelete = function (req, res) {

};