var express = require('express');
var app = express();
var mongodb = require('./mongo_connection');

// Starting server...
var server = app.listen(process.env.npm_package_config_port, function () {
    console.log('Sango started.');
    console.log('Listening on port '+process.env.npm_package_config_port+'.');
});

// Connecting to database...
mongodb.connect
    .then(function () {
	// Loading routes...
        var groups = require('./routes/groups');
        app.use('/api/groups', groups);
        var courses = require('./routes/courses');
        app.use('/api/courses', courses);
        var students = require('./routes/students');
        app.use('/api/students', students);
        var assessments = require('./routes/assessments');
        app.use('/api/assessments', assessments);
        var ingest = require('./routes/ingest');
        app.use('/api/ingest', ingest);

	// Client app...
        app.use('/node_modules', express.static('node_modules'));
        app.use('/assets', express.static('web/assets'));
        app.use('/app', express.static('web/app'));
	app.use('*', express.static('web'));
    })
    .catch(function (err) {
        // Close server on database connection error.
	console.error('Error connecting to database.');
        console.error(err);
	console.info('Stopping server...');
	server.close();
    });

/*
 * Helper function to close database connection and finalize
 * server execution.
 */
function closeDBConnectionAndExit() {
    console.info('Closing database connection...');
    mongodb.db.close();
    console.info('Stopping server...');
    server.close();
    process.exit();
}

// Close database connections on termination
process.on('SIGINT', () => {
    closeDBConnectionAndExit();
});

process.on('SIGTERM', () => {
    closeDBConnectionAndExit();
});

