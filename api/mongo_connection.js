var MongoClient = require('mongodb').MongoClient;

// Connect to database
exports.connect = MongoClient.connect(process.env.npm_package_config_db_url)
	.then(function(db) {
		console.log('Connected to database.');
		exports.db = db;
	});
