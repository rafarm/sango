var session = require('express-session');
var MongoStore = require('connect-mongodb-session')(session);

const db_sessions_uri = process.env.npm_package_config_db_url + 
    '/' +
    process.env.npm_package_config_db_name;
const db_sessions_collection = 'sessions';

module.exports = session({
	secret: 'SangoRocks!!(but change this, please)',
	cookie: {
	    maxAge: parseInt(process.env.npm_package_config_cookie_max_age)
	},
	store: new MongoStore({
	    uri: db_sessions_uri,
	    collection: db_sessions_collection
	}),
	resave: false,
	saveUninitialized: false
    });
