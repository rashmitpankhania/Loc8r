var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = function (res, status, content) {
	res.status(status);
	res.json(content);
};


module.exports.locationsListBydistance = function (req, res) {
	sendJsonResponse(res, 200, {'status': 'Sucess'});
	
};
module.exports.locationCreate = function (req, res) {
	
};
module.exports.locationRead = function (req, res) {
	
};
module.exports.locationUpdate = function (req, res) {
	
};
module.exports.locationDelete =  function (req, res) { 
	
};
