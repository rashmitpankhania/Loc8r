module.exports.index = function (req, res, next) {
	// body...
	res.render('index', {'title': "Rashmit"});
}

module.exports.about = function (req, res, next) {
	// body...
	res.send('hello fuck you');
}