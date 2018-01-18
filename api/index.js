var express = require('express');
var https = require('https');
var fs = require('fs');
var app = express();
var mongodb = require('./mongo_connection');

var passport = require('passport');
var LdapStrategy= require('passport-ldapauth').Strategy;
var session = require('express-session');
var MongoStore = require('connect-mongodb-session')(session);
var flash = require('connect-flash');
var bodyParser = require('body-parser');

// Set template engine...
app.set('views', 'web');
app.set('view engine', 'ejs');

// Set SSL certs...
var ssl_options = {
    key: fs.readFileSync(process.env.npm_package_config_key),
    cert: fs.readFileSync(process.env.npm_package_config_cert)
};

// Sessions&users collections...
const db_sessions_collection = 'sessions';
const db_users_collection = 'users';

// Starting server...
//var server = app.listen(process.env.npm_package_config_port, function () {
var server = https.createServer(ssl_options, app).listen(process.env.npm_package_config_port, function () {
    console.log('Sango started.');
    console.log('Listening on port '+process.env.npm_package_config_port+'.');
});

// Session...
app.use(session({
    secret: 'SangoRocks!!(but change this, please)',
    cookie: {
	maxAge: parseInt(process.env.npm_package_config_cookie_max_age)
    },
    store: new MongoStore({
        uri: process.env.npm_package_config_db_url,
        collection: db_sessions_collection
    }),
    resave: false,
    saveUninitialized: false
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());

// Configure passport...
var ldapOps = {
    server: {
	url: process.env.npm_package_config_ldap_url,
	bindDN: process.env.npm_package_config_ldap_bindDN,
	bindCredentials: process.env.npm_package_config_ldap_bindCredentials,
	searchBase: process.env.npm_package_config_ldap_searchBase,
	searchFilter: process.env.npm_package_config_ldap_searchFilter
    },
    handleErrorsAsFailures: false
};

passport.use(new LdapStrategy(ldapOps));
app.use(passport.initialize());
app.use(passport.session());

// Session management...
passport.serializeUser((user, done) => {
    done(null, user.uid);
});
passport.deserializeUser((id, done) => {
    mongodb.db.collection(db_users_collection)
	.find({uid:id})
	.limit(1)
	.next((err, user) => {
	    if (err) return done(err);
	    return done(null, user);
	});
});

// Connecting to database...
mongodb.connect
    .then(() => {
	console.log('Connected to database.');
	
	// Catch unauthorized api calls...
	app.use('/api', (req, res, next) => {
	    if ( !req.isAuthenticated || !req.isAuthenticated() ) {
		return res.status(401).end();
	    }
	    next();
	});
    
	// Loading API routes...
	var groups = require('./routes/groups');
	app.use('/api/groups', groups);
	//var courses = require('./routes/courses');
	//app.use('/api/courses', courses);
	var students = require('./routes/students');
	app.use('/api/students', students);
	var assessments = require('./routes/assessments');
	app.use('/api/assessments', assessments);
	var ingest = require('./routes/ingest');
	app.use('/api/ingest', ingest);

	// Login...
	app.post('/login', (req, res, next) => {
	    passport.authenticate('ldapauth', (err, user, info) => {
		if (err) {
		    return next(err)
		};
		if (!user) {
		    req.flash('error', info.message);
		    return res.redirect('/login');
		}
		req.login(user, (err) => {
		    if (err) {
			return next(err);
		    }

		    //Save user into database.
		    const db_user = {
			uid: user.uid,
			dn: user.dn,
			cn: user.cn,
			uidNumber: user.uidNumber,
			gidNumber: user.gidNumber
		    }
		    mongodb.db.collection(db_users_collection).updateOne(
			{ uid: user.uid },
			{ $set: db_user },
			{ upsert: true },
			(err, result) => {
			    if (err) {
				return next(err);
			    }
			    if (req.session && req.session.returnTo) {
				return res.redirect(req.session.returnTo);
			    }
			    return res.redirect('/');
			}
		    );
		});
	    })(req, res, next);
	});
	app.get('/login', (req, res) => {
	    if ( req.isAuthenticated && req.isAuthenticated() ) {
		return res.redirect('/');
	    }
	    res.render('login/index', { error: req.flash('error')[0] });
	});

	// Logout...
	app.use('/logout', (req, res) => {
	    req.logout();
	    res.redirect('/login');
	});
	
	// Resources...
	app.use(express.static('web'));
	
	// Catch unauthorized web access...
	app.use('*', (req, res, next) => {
	    if ( !req.isAuthenticated || !req.isAuthenticated() ) {
		if ( req.session ) {
		    req.session.returnTo = req.originalUrl || req.url;
		}

		return res.redirect('/login');
	    }
	    res.render('index', { user: req.user });
	});
    })
    .catch((err) => {
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

