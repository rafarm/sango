var express = require('express');
var router = express.Router();
var mongodb = require('../mongo_connection');
var assessmentsCollection = mongodb.db.collection('assessments');
var bodyParser = require('body-parser');
var wrapResult = require('./wrap-result').wrapResult;

// TODO: Match by school.

/*
 * /assessments GET
 * 
 * Returns all assessments.
 */
router.get('/', function(req, res) {
    assessmentsCollection.find().toArray()
	.then(function(assessments) {
	    res.json(wrapResult(assessments));
	})
	.catch(function(err) {
	    res.status(500);
	    res.json(err);
	});
});

/*
 * /assessments/:id GET
 * 
 * Returns the assessment identified by 'id'.
 */
router.get('/:id', function(req, res) {
    assessmentsCollection.findOne({'_id': req.params.id})
	.then(function(assessment) {
	    res.json(wrapResult(assessment));
	})
	.catch(function(err) {
	    res.status(500);
	    res.json(err);
	});
});

/*
 * /assessments/:id PUT
 *
 * Replaces the assessment identified by 'id' by
 * the one received.
 */
router.put('/:id', bodyParser.json(), function(req, res) {
    assessmentsCollection.replaceOne({ '_id': req.params.id }, req.body, null)
	.then(result => res.json(wrapResult(result)))
	.catch(function(err) {
	    res.status(500);
	    res.json(err);
	});
});

/*
 * /assessments POST
 * 
 * Inserts a new assessment.
 */
router.post('/', bodyParser.json(), function(req, res) {
    assessmentsCollection.insertOne(req.body, null)
	.then(function(result) {
	    console.info('assessment POST: ' + result);
	    res.json(wrapResult(result));
	})
	.catch(function(err) {
	    console.error('assessment POST: ' + err);
	    res.status(500);
	    res.json(err);
	});
});

/*
 * /assessments/many POST
 * 
 * Inserts an array of new assessments.
 */
router.post('/many', bodyParser.json(), function(req, res) {
    assessmentsCollection.insertMany(req.body, null)
	.then(function(result) {
	    console.info('assessments/many POST: ' + result);
	    res.json(wrapResult(result));
	})
	.catch(function(err) {
	    console.error('assessments/many POST: ' + err);
	    res.status(500);
	    res.json(err);
	});
});

module.exports = router;
