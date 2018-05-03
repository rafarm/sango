const MongoClient = require('mongodb').MongoClient;

const db = process.env.npm_package_config_db_name;
const url = process.env.npm_package_config_db_url;

// Connect to database
exports.connect = MongoClient.connect(url)
    .then(client => {
	exports.client = client;
        exports.db = client.db(db);
    });
