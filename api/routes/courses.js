var express = require('express');
var router = express.Router();
var mongodb = require('../mongo_connection');
var coursesCollection = mongodb.db.collection('courses');
var ObjectID = require('mongodb').ObjectID;

/*
 * /courses GET
 * 
 * Returns all courses.
 */
router.get('/', function(req, res) {
	coursesCollection.find().toArray()
		.then(function(courses) {
			res.json(courses);
		})
		.catch(function(err) {
			res.status(500);
			res.json(err);
		});
});

/*
 * /courses/:id GET
 * 
 * Returns the course identified by 'id'.
 */
router.get('/:id', function(req, res) {
	var o_id = new ObjectID(req.params.id);
	coursesCollection.findOne({'_id': o_id})
		.then(function(course) {
			res.json(course);
		})
		.catch(function(err) {
			res.status(500);
			res.json(err);
		});
});

router.post('/', function(req, res) {
	res.send('TODO: Create a new Course...');
});

module.exports = router;
