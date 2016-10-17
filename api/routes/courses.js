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

/*
 * /courses/:id/stats/bystudent GET
 * 
 * Returns averages and failed/passes count by student
 * of the course identified by 'id'.
 */
router.get('/:id/stats/bystudent', function(req, res) {
    var o_id = new ObjectID(req.params.id);
    var pipe = [
        { $match: { _id: o_id } },
        { $unwind: '$assessments' },
        { $lookup: {
            from: 'assessments',
            localField: 'assessments.assessment_id',
            foreignField: '_id',
            as: 'assessment_data'
        } },
        { $unwind: '$assessment_data' },
        { $unwind: '$assessment_data.students' },
        { $project: {
            assessment_id: '$assessment_data._id',
            student_id: '$assessment_data.students.student_id',
            passed: {
                $filter: {
                    input: '$assessment_data.students.qualifications',
                    as: 'q',
                    cond: {
                        $gte: [ '$$q.qualification' , 5 ]
                    }
                }
            },
            failed: {
                $filter: {
                    input: '$assessment_data.students.qualifications',
                    as: 'q',
                    cond: {
                        $and: [
                            { $ne: [ '$$q.qualification', null ] },
                            { $lt: [ '$$q.qualification', 5 ] }
                        ]
                    }
                }
            },
            avg: {
                $avg: '$assessment_data.students.qualifications.qualification'
            }
        } },
        { $project: {
            assessment_id: 1,
            student_id: 1,
            passed: { $size: '$passed' },
            failed: { $size: '$failed' },
            avg: 1
        } },
        { $project: {
            assessment_id: 1,
            student_id: 1,
            passed: 1,
            failed: 1,
            sum: { $add: [ '$passed', '$failed' ] },
            avg: 1
        } },
        { $project: {
            assessment_id: 1,
            student_id: 1,
            passed: 1,
            failed: 1,
            ratio: { $divide: [ '$passed', '$sum' ] },
            avg: 1
        } },
        { $group: {
            _id: '$assessment_id',
            students: {
                $push: {
                    student_id: '$student_id',
                    passed: '$passed',
                    failed: '$failed',
                    ratio: '$ratio',
                    avg: '$avg'
                }
            }
        } }
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
 * /courses/:id/stats/bysubject GET
 * 
 * Returns averages and failed/passes count by subject
 * of the course identified by 'id'.
 */
router.get('/:id/stats/bysubject', function(req, res) {
    var o_id = new ObjectID(req.params.id);
    var pipe = [
	{ $match: { _id: o_id} },
	{ $unwind: '$assessments' },
	{ $lookup: {
	    from: 'assessments',
	    localField: 'assessments.assessment_id',
	    foreignField: '_id',
	    as: 'assessment_data'
	} },
	{ $unwind: '$assessment_data' },
	{ $unwind: '$assessment_data.students' },
	{ $unwind: '$assessment_data.students.qualifications' },
	{ $group: {
	    _id: {
		assessment_id: '$assessment_data._id',
		subject_id: '$assessment_data.students.qualifications.subject_id'
	    },
	    qualifications: {
		$push: '$assessment_data.students.qualifications.qualification'
	    }
	} },
	{ $project: {
	    passed: {
		$filter: {
		    input: '$qualifications',
		    as: 'q',
		    cond: {
			$gte: [ '$$q', 5]
                    }
		}
	    },
	    failed: {
		$filter: {
		    input: '$qualifications',
		    as: 'q',
		    cond: {
			$and: [
			    {
				$ne: [ '$$q', null ]
			    },
			    { 
				$lt: [ '$$q', 5 ] 
			    } 
			]
		    }
		}
	    },
	    avg: { $avg:'$qualifications' }
	} },
	{ $project: {
	    passed: { $size: '$passed' },
	    failed: { $size: '$failed' },
	    avg: 1
	} },
        { $project: {
            passed: 1,
            failed: 1,
            sum: { $add: [ '$passed', '$failed' ] },
            avg: 1
        } },
        { $project: {
            passed: 1,
            failed: 1,
            ratio: { $divide: [ '$passed', '$sum' ] },
            avg: 1
        } },
	{ $group: {
	    _id: '$_id.assessment_id',
	    subjects: {
		$push: {
		    subject_id: '$_id.subject_id',
		    passed: '$passed',
		    failed: '$failed',
                    ratio: '$ratio',
		    avg: '$avg'
		}
	    }
	} }
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

router.post('/', function(req, res) {
    res.send('TODO: Create a new Course...');
});

module.exports = router;
