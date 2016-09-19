var express = require('express');
var app = express();

// Starting server...
var server = app.listen(process.env.npm_package_config_port, function () {
	console.log('Sango started.');
	console.log('Listening on port '+process.env.npm_package_config_port+'.');
});

// Connecting to database...
var mongodb = require('./mongo_connection');
mongodb.connect
	.then(function () {
		// Loading routes...
		var courses = require('./routes/courses');
		app.use('/api/courses', courses);
		var students = require('./routes/students');
		app.use('/api/students', students);
	})
	.catch(function (err) {
		// Close server on database connection error.
		console.error(err);
		console.info('Closing server...');
		server.close();
	});


