var express = require('express');
var router = express.Router();
var mongodb = require('../mongo_connection');
var studentsCollection = mongodb.db.collection('students');
var bodyParser = require('body-parser');
var wrapResult = require('./wrap-result').wrapResult;

/*
 * /students GET
 * 
 * Returns all students in query array or all students
 * if there's no query array.
 */
router.get('/', function(req, res) {
    console.log('students GET: ' + req.query.ids);
    var filter = null;
    if (req.query.ids != null) {
	filter = { _id: { $in: req.query.ids } };
    }
    studentsCollection.find(filter).toArray()
	.then(function(students) {
	    res.json(wrapResult(students));
	})
	.catch(function(err) {
	    res.status(500);
	    res.json(err);
	});
});

/*
 * /students/:id GET
 * 
 * Returns the student identified by 'id'.
 */
router.get('/:id', function(req, res) {
    studentsCollection.findOne({'_id': req.params.id})
	.then(function(student) {
	    res.json(wrapResult(student));
	})
	.catch(function(err) {
	    res.status(500);
	    res.json(err);
	});
});

/*
 * /students POST
 * 
 * Inserts a new student.
 */
router.post('/', bodyParser.json(), function(req, res) {
    studentsCollection.insertOne(req.body, null)
	.then(function(result) {
	    console.info('studentPOST: ' + result);
	    res.json(wrapResult(result));
	})
	.catch(function(err) {
	    console.error('students POST: ' + err);
	    res.status(500);
	    res.json(err);
	});
});

/*
 * /students/many POST
 * 
 * Inserts an array of new students.
 */
router.post('/many', bodyParser.json(), function(req, res) {
    studentsCollection.insertMany(req.body, null)
	.then(function(result) {
	    console.info('students/many POST: ' + result);
	    res.json(wrapResult(result));
	})
	.catch(function(err) {
	    console.error('students POST: ' + err);
	    res.status(500);
	    res.json(err);
	});
});

module.exports = router;
