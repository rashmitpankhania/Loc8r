var mongoose = require('mongoose');
var dbUrl = 'mongodb://127.0.0.1/Loc8r';

if(process.env.NODE_ENV === 'production') {
	dbUrl = process.env.MONGOLAB_URI;
};
var gracefulShutdown = function (msg, callback) {
	mongoose.connection.close(function () {
		console.log('Mongoose disconnected though: ' + msg);
		callback();
	});
};

mongoose.connect(dbUrl);
mongoose.connection.on('connected', function() {
	console.log('Mongoose is connected to ' + dbUrl);
});

mongoose.connection.on('error', function(err) {
	console.log('Connection Error: ' + err);
});

mongoose.connection.on('disconnected', function () {
	console.log('Mongoose disconnected');
})

process.once('SIGUSR2', function () {
	gracefulShutdown('nodemon restart', function () {
		process.kill(process.pid, 'SIGUSR2');
	});
});

process.on('SIGINT', function () {
	gracefulShutdown('app termination', function () {
		process.exit(0);
	});
});

process.on('SIGTERM', function() {
	gracefulShutdown('Heroku app shutdown', function () {
		process.exit(0);
	});
});

require('./locations');