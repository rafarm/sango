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

/*
 * /assessments/:id/statistics/bystudent GET
 * 
 * Inserts an array of new assessments.
 */
router.get('/:id/stats/bystudent', function(req, res) {
    assessmentsCollection.aggregate([
	{ $match:{ _id: req.params.id } },
	{ $unwind: '$students' },
	{ $project: {
	    student_id: '$students.student_id',
	    passed: {
		$filter: {
		    input: '$students.qualifications',
		    as: 'qualification',
		    cond: { $gte: [ '$$qualification.qualification', 5 ] }
		}
	    },
	    failed: {
		$filter: {
		    input: '$students.qualifications',
		    as: 'qualification',
		    cond: { $and:[ 
			{ $ne: [ '$$qualification.qualification', null ] },
			{ $lt: [ '$$qualification.qualification', 5 ] } 
		    ] }
		}
	    },
	    qualifications: '$students.qualifications'
	}},
	{ $project: {
	    student_id: 1,
	    passed: { $size: '$passed' },
	    failed: { $size: '$failed' },
	    qualifications: 1
	}},
	{ $unwind: '$qualifications' },
	{ $group: {
	    _id: { student_id: '$student_id', passed: '$passed', failed: '$failed' },
	    avg: { $avg: '$qualifications.qualification' }
	}},
	{ $group: {
	    _id: '$_id.student_id',
	    passed: { $first: '$_id.passed' },
	    failed: { $first: '$_id.failed' },
	    avg: { $first: '$avg' }
	}}
    ], function(err, result) {
	if (err != null) {
	    res.status(500);
	    res.json(err);
	}
	else {
	    res.json(wrapResult(result));
	}
    }); 
});

module.exports = router;
