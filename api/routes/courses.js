var express = require('express');
var router = express.Router();
var mongodb = require('../mongo_connection');
var coursesCollection = mongodb.db.collection('courses');
var ObjectID = require('mongodb').ObjectID;
var wrapResult = require('./wrap-result').wrapResult;

/*
 * /courses GET
 * 
 * Returns all courses.
 */
router.get('/', function(req, res) {
    coursesCollection.find().toArray()
	.then(function(courses) {
	    res.json(wrapResult(courses));
	})
	.catch(function(err) {
	    res.status(500);
	    res.json(err);
	});
});

/*
 * /courses/byyear GET
 * 
 * Returns the courses identification data organized in a tree
 * structure grouped by year to create courses navigation menu.
 */
router.get('/byyear', function(req, res) {
    // TODO: Match by school
    var pipe = [
            {
                $project: {
                    academic_year: 1,
                    name:  { $concat: [ "$level", " ", "$stage", " ", "$name" ] },
                    assessments: 1
                }
            },
            {   $unwind: "$assessments" },
            {	$sort: { "assessments.order": 1 } },
            {
                $group: {
                    _id: { academic_year: "$academic_year", name: "$name", course_id: "$_id" },
                    assessments: {
                        $push: {
                            assessment_id: "$assessments.assessment_id",
                            name: "$assessments.name"
                        }
                    }
                }
            },
            {	$sort: { "_id.name": 1 } },
            {
                $group: {
                    _id: "$_id.academic_year",
                    courses: {
                        $push: {
                            name: "$_id.name",
                            course_id: "$_id.course_id",
                            assessments: "$assessments"
                        }
                    }
                }
            },
            { 	$sort: { "_id": -1 } }
        ];

    coursesCollection.aggregate(pipe, function(err, result) {
	if (err != null) {
	    res.status(500);
	    res.json(err);
	}
	else {
	    res.json(wrapResult(result));
	}
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
	    res.json(wrapResult(course));
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
