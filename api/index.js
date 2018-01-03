var express = require('express');
var https = require('https');
var fs = require('fs');
var app = express();
var mongodb = require('./mongo_connection');

var ldap = require('ldapjs');
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
        collection: 'sessions'
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
var ldapClient = ldap.createClient({ url: ldapOps.server.url });

passport.use(new LdapStrategy(ldapOps));
app.use(passport.initialize());
app.use(passport.session());

// Session management...
passport.serializeUser((user, done) => {
    done(null, user.uid);
});
passport.deserializeUser((id, done) => {
    ldapClient.bind(ldapOps.server.bindDN, ldapOps.server.bindCredentials, (err) => {
        if (err) return done(err);

        var ops = {
            scope: 'sub',
            filter: '(uid='+id+')',
            attributes: ['cn'],
	    sizeLimit: 1
        };
	ldapClient.search(ldapOps.server.searchBase, ops, (err, resp) => {
	    resp.on('searchEntry', (entry) => {
		done(null, entry.object);
            });
            resp.on('error', (err) => {
		done(err);
            });
        });
    });
});

// Connecting to database...
mongodb.connect
    .then(function () {
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
        var courses = require('./routes/courses');
        app.use('/api/courses', courses);
        var students = require('./routes/students');
        app.use('/api/students', students);
        var assessments = require('./routes/assessments');
        app.use('/api/assessments', assessments);
        var ingest = require('./routes/ingest');
        app.use('/api/ingest', ingest);

	// Resources...
        app.use('/node_modules', express.static('node_modules'));
        app.use('/assets', express.static('web/assets'));

	// Login...
	app.post('/login',
	    passport.authenticate('ldapauth',
		{ 
		    successReturnToOrRedirect: '/',
		    failureRedirect: '/login',
		    failureFlash: true
		}
	    )
	);
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
	
	// Client app..
        app.use('/app', express.static('web/app'));
	
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

