module.exports.homeList = function (req, res){
	res.render('locations-list', {'title': 'Fuck'})
}

module.exports.locationInfo = function (req, res){
	res.render('location-info', {'title': 'Location Info.'})
}

module.exports.addReview = function (req, res){
	res.render('index', {'title': 'Add Review'})
}