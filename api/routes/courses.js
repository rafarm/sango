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
 * /courses/tree GET
 * 
 * Returns the courses identification data organized in a tree
 * structure to create courses navigation menu.
 */
router.get('/tree', function(req, res) {
    // TODO: Match by school
    coursesCollection.aggregate(
	[
	    {
		$project: {
		    academic_year: 1,
		    group:  { $concat: [ "$level", " ", "$stage", " ", "$name" ] },
		    assessments: 1
		}
	    },
	    {
		$unwind: "$assessments"
	    },
	    {
		$sort: { group: 1, "assessments.order": 1 }
	    },
	    {
		$lookup: {
		    from: "assessments",
		    localField: "assessments.assessment_id",
		    foreignField: "_id",
		    as: "assessments_data"
		}
	    },
	    {
		$unwind: "$assessments_data"
	    },
	    {
		$project: {
		    academic_year: 1,
		    group: 1,
		    "assessments.assessment_id": 1,
		    "assessments_data.name": 1
		}
	    },
	    {
		$group: {
		    _id: { academic_year: "$academic_year", group: "$group", course_id: "$_id" },
		    assessments: {
			$push: {
			    assessments_id: "$assessments.assessment_id",
			    assessments_name: "$assessments_data.name"
			}
		    }
		}
	    },
	    {
		$group: {
		    _id: "$_id.academic_year",
		    groups: {
			$push: {
			    group: "$_id.group",
			    course_id: "$_id.course_id",
			    assessments_id: "$assessments.assessments_id",
			    assessments_name: "$assessments.assessments_name"
			}
		    }
		}
	    }
	],
	function(err, result) {
	    if (err != null) {
		res.status(500);
		res.json(err);
	    }
	    else {
		res.json(result);
	   }
    	}
    );
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
