var request = require('request');
var apiOptions = {
	server: "http://127.0.0.1:3000"
};
if (process.NODE_ENV === 'production') {
	apiOptions.server = 'https://nameless-everglades-71725.herokuapp.com';
}

var formatDistance = function (distance) {
	var unit, numDistance;
	if(distance>1){
		unit = 'km';
		numDistance = parseFloat(distance).toFixed(1);
	} else {
		unit = 'm';
		numDistance = parseInt(distance * 1000, 10);
	}
	return numDistance + unit;
}

var renderHomePage = function (req, res, body) {
	res.render('locations-list', {
		title: 'Loc8r - find a place to work with wifi',
		pageHeader: {
			title: 'Loc8r',
			strapline: 'Find a place to work with wifi!'
		},
		locations: body,
		sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for."
	});
}
module.exports.homelist = function (req, res) {
	var requestOptions, path;
	path = '/api/location';
	requestOptions = {
		url: apiOptions.server + path,
		method: "GET",
		json: {},
		qs: {
			lng: -0.9690884,
			lat: 51.455041001,
			maxDistance: 20,
		}
	};
	request(requestOptions, function (err, response, body) {
		if(response.statusCode === 200 && body.length){
			for (let i = 0; i < body.length; i++) {
				body[i].distance = formatDistance(body[i].distance);			
			}
		}		
		renderHomePage(req, res, body);
	});
};

module.exports.locationInfo = function (req, res) {
	res.render('location-info', {
		title: 'Location Info.',
		location: {
			name: 'Surtea',
			address: '125 High Street, Reading, RG6 1PS',
			rating: 3,
			facilities: ['Hot drinks', 'Food', 'Premium wifi'],
			distance: '1000m'
		},
		coords: { lat: 51.455041, lng: -0.9690884 },
		openingTimes: [
			{
				days: 'Monday-Wednesday',
				open: '7:00 AM',
				close: '7:00 PM',
				closed: false,
			},
			{
				days: 'Thursday-Friday',
				open: '7:00 AM',
				close: '7:00 PM',
				closed: false,
			},
			{
				days: 'Saturday-Sunday',
				open: '7:00 AM',
				close: '7:00 PM',
				closed: true,
			}
		],
		reviews: [
			{
				name: 'Simon Holmes',
				date: '16 July 2013',
				rating: 5,
				comment: 'What a great place. I can\'t say enough good things about it',
			},
			{
				name: 'Simon Holmes',
				date: '16 July 2013',
				rating: 5,
				comment: 'What a great place. I can\'t say enough good things about it',
			},
			{
				name: 'Simon Holmes',
				date: '16 July 2013',
				rating: 5,
				comment: 'What a great place. I can\'t say enough good things about it',
			},
		]
	})
};

module.exports.addReview = function (req, res) {
	res.render('location-review-form', { title: 'Add Review' })
};