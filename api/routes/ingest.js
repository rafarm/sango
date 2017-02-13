var express = require('express');
var router = express.Router();
var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({storage: storage});

// Load data file parser defined in package config section.
var parser = require('../parsers/' + process.env.npm_package_config_parser);

/*
 * /ingest POST
 * 
 * Receives and parses a file containing
 * data to ingest into database.
 */
router.post('/', upload.single('upload'), function (req, res, next) {
    console.log('Ingest - file received: '+ req.file.originalname);

    next();
});

/*
 * User package defined parser to parse and
 * ingest uploaded data file.
 */
router.post('/', parser);

module.exports = router;
