var express = require('express');
var router = express.Router();
var multer = require('multer');
//var storage = multer.memoryStorage();
var path = process.env.npm_package_config_upload_path;
var storage = multer.diskStorage({
    destination: path
});
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
    res.send(req.file.filename);
});

/*
 * After uploading file, client inits a SSE connection
 * for tracking file processing.
 *
 * First, set required headers and add SSE utility functions to res.
 */
router.get('/:name', function (req, res, next) {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    res.sseSend = (data) => {
	res.write("data: " + data + "\n\n");
    };

    res.sseError = (data) => {
	res.write("event: error\n");
	res.sseSend(data);
    };

    res.sseEnd = (data) => {
	res.write("event: end\n");
	res.sseSend(data);
    };

    next();
});

/*
 * User package defined parser to parse and
 * ingest uploaded data file with name 'name'.
 */
router.get('/:name', parser);

module.exports = router;
