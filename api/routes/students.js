var express = require('express');
var router = express.Router();
var mongodb = require('../mongo_connection');
var studentsCollection = mongodb.db.collection('students');
var bodyParser = require('body-parser');

/*
 * /students GET
 * 
 * Returns all students.
 */
router.get('/', function(req, res) {
	studentsCollection.find().toArray()
		.then(function(students) {
			res.json(students);
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
			res.json(student);
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
			console.info('student POST: ' + result);
			res.json(result);
		})
		.catch(function(err) {
			console.error('student POST: ' + err);
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
			console.info('student/many POST: ' + result);
			res.json(student);
		})
		.catch(function(err) {
			console.error('student POST: ' + err);
			res.status(500);
			res.json(err);
		});
});

module.exports = router;
