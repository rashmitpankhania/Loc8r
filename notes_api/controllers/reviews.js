var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = function (res, status, content) {
	res.status(status);
	res.set({ 'Content-Type': 'application/json; charset=utf-8' }).status(200).send(JSON.stringify(content, undefined, '\t'));
};

var doSetAverageRating = function (location) {
	var sum = 0;
	for (let index = 0; index < location.reviews.length; index++) {
		sum = sum + location.reviews[index].rating;
	}
	location.rating = parseInt(sum / location.reviews.length, 10);
	location.save(function (err) {
		if (err) {
			console.log(err);
		} else {
			console.log('Rating has been updated')
		}
	})

};

var updateReviewRating = function (locationid) {
	Loc
		.findById(locationid)
		.select('rating reviews')
		.exec(function (err, location) {
			if (err) {
				sendJsonResponse(res, 400, err)
			} else {
				doSetAverageRating(location);
			}
		})
};

module.exports.reviewCreate = function (req, res) {
	var l = req.params.locationid;
	if (l) {
		Loc
			.findById(l)
			.exec(function (err, location) {
				if (err) {
					sendJsonResponse(res, 400, err);
				} else {
					location.reviews.push({
						author: req.body.author,
						rating: req.body.rating,
						comment: req.body.comment
					});
					location.save(function (err, location) {
						var thisReview;
						if (err) {
							sendJsonResponse(res, 400, err)
						} else {
							updateReviewRating(location._id)
							thisReview = location.reviews[location.reviews.length - 1];
							sendJsonResponse(res, 201, thisReview)
						}
					})
				}
			})
	} else {
		sendJsonResponse(res, 400, {
			message: "bhai not found wala error"
		});
	}

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
	var locationid = req.params.locationid;
	var reviewid = req.params.reviewid;
	if (!locationid || !reviewid) {
		sendJsonResponse(res, 404, {
			message: 'locationid or review id may be missing'
		});
	} else {
		Loc
			.findById(location)
			.select('reviews')
			.exec(function (err, location) {
				if (!location) {
					sendJsonResponse(res, 404, {
						message: 'please enter right locations'
					});
				} else if (err) {
					sendJsonResponse(res, 404, err)
				} else {
					if (location.reviews) {
						thisReview = location.reviews.id(reviewid);
						if (!thisReview) {
							sendJsonResponse(res, 404, {
								message: 'review not found'
							});
						} else {
							thisReview.author = req.body.author;
							thisReview.comment = req.body.comment;
							thisReview.rating = req.body.rating;
							location.save(function (err, location) {
								if (err) {
									sendJsonResponse(res, 404, err)
								} else {
									sendJsonResponse(res, 200, thisReview)
								}
							});
						}
					}
				}
			});
	}
};

module.exports.reviewDelete = function (req, res) {
	var locationid = req.params.locationid;
	var reviewid = req.params.reviewid;
	if (!locationid && !reviewid) {
		sendJsonResponse(res, 404, {
			message: "locationid or review id may be missing for deleting review"
		});
	} else {
		Loc
			.findById(locationid)
			.select('reviews')
			.exec(function(err, location){
				if(!location){
					sendJsonResponse(res, 404, {
						message: 'please enter correct locationid for deleting review'
					});
				} else if(err) {
					sendJsonResponse(res, 404, err);
				} else {
					if(location.reviews){
						if(!location.reviews.id(reviewid)){
							sendJsonResponse(res, 404, {
								message: 'incorrect review id for deleting'
							});
						} else {
							location.reviews.id(reviewid).remove();
							location.save(function(err, location){
								if(err){
									sendJsonResponse(res, 404, err);
								} else {
									updateReviewRating(locationid);
									sendJsonResponse(res, 204, null);
								}
							})
						}
					} else {
						sendJsonResponse(res, 404, {
							message: 'there are no reviews in this locationid for deleting this review'
						});
					}
					
				}
			});
	}
}; 
