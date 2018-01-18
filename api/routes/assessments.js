var express = require('express');
var router = express.Router();
var mongodb = require('../mongo_connection');
var assessmentsCollection = mongodb.db.collection('assessments');
var bodyParser = require('body-parser');
var performAggregation = require('./utils').performAggregation;
var wrapResult = require('./utils').wrapResult;
var resError = require('./utils').resError;
var collation = { locale: process.env.npm_package_config_locale };

// TODO: Match by school.

/*
 * /assessments/:id/qualifications?group_id GET
 * 
 * Returns the assessment's qualifications data for assesment
 * identified by 'id'. Students data can be filtered by group id.
 */
router.get('/:id/qualifications', function(req, res) {
    var pipe = [
	{
	    $match: {
                _id: req.params.id
            }
        },
        {
            $project: {
                grades: 1
            }
        }
    ];

    if (req.query.group_id != null) {
        var by_group = [{
            $unwind: '$grades'
        },
        {
            $project: {
                student_id: '$grades.student_id',
                qualifications: '$grades.qualifications'
            }
        },
        {
            $lookup: {
                from: 'students',
                localField: 'student_id',
                foreignField: '_id',
                as: 'student_data'
            }
        },
        {
            $match: {
                'student_data.enrolments.group_id': req.query.group_id
            }
        },
        {
            $group: {
                _id: '$_id',
                grades: {
                    $push: {
                        student_id: '$student_id',
                        qualifications: '$qualifications'
                    }
                }
            }
        }]
	pipe = pipe.concat(by_group);
    }

    return performAggregation(res, assessmentsCollection, pipe, true);
});

/*
 * /assessments/:id/qualifications PUT
 * 
 * Updates qualifications data for assessment
 * identified by 'id'.
 */
router.put('/:id/qualifications', bodyParser.json(), function(req, res) {
    var grades = req.body.grades;

    if (grades != undefined) {
	var insertStudent = function(index, wr) {
	    if (index < grades.length) {
		var st = grades[index];
		assessmentsCollection.update(
		    { _id: req.params.id },
		    { $push: { grades: st } })
		    .then(result => {
			var r = result.result;
			wr.ok += r.ok;
			wr.nModified += r.nModified;
			wr.n += r.n;

			updateStudent(++index, wr);
                    })
		    .catch(err => {
			resError(err);
		    });
	    }
	    else {
		wrapResult(res, wr);
            }
        };

	var updateStudent = function(index, wr) {
	    if (index < grades.length) {
		var st = grades[index];
		assessmentsCollection.update(
		    { _id: req.params.id, 'grades.student_id': st.student_id },
		    { $set: { 'grades.$.qualifications': st.qualifications } })
		    .then(result => {
			var r = result.result;
			if (r.n == 0) {
			    insertStudent(index, wr);
			}
			else {
			    wr.ok += r.ok;
			    wr.nModified += r.nModified;
			    wr.n += r.n;

			    updateStudent(++index, wr);
			}
		    })
		    .catch(err => {
			resError(err);
		    });
	    }
	    else {
                wrapResult(res, wr);
            }
	};

	var wr = {
	    ok: 0,
	    nModified: 0,
	    n: 0
	};
	updateStudent(0, wr);
    }
    else {
	resError('No grades received.');
    }
});

/*
 * /assessments/bycourse/:id/:year GET
 * 
 * Returns the assessments corresponding to course with 'id'
 * for the course's 'year'.
 * Course's subjects are also included.
 */
router.get('/bycourse/:id/:year', function(req, res) {
    var pipe = [
	{
	    $match: {
		year: req.params.year,
		course_id: req.params.id
	    }
	},
	{
	    $project: {
		year: 1,
		name: 1,
		course_id: 1,
		order: 1
	    }
	},
	{
	    $lookup: {
		from: 'courses',
		localField: 'course_id',
		foreignField: '_id',
		as: 'course'
	    }
	},
	{
	    $unwind: '$course'
	},
	{
	    $sort: {
		order:1
	    }
	},
	{
	    $group: {
		_id: {
		    _id: '$course_id',
		    year: '$year',
		    name: '$course.name',
		    short_name: '$course.short_name'
		},
		assessments: {
		    $push: {
			_id: '$_id',
			name: '$name'
		    }
		}
	    }
	},
	//{
	//    $lookup: {
	//	from: 'subjects',
	//	localField: '_id._id',
	//	foreignField: 'course_id',
	//	as: 'subjects'
	//    }
	//},
	//{
	//    $unwind: '$subjects'
	//},
	//{
	//    $group: {
	//	_id: {
	//	    _id: '$_id',
	//	    assessments: '$assessments'
	//	},
	//	subjects: {
	//	    $push: {
	//		_id: '$subjects._id',
	//		name: '$subjects.name'
	//	    }
	//	}
	//    }
	//},
	{
	    $project: {
		_id: '$_id._id',
		name: '$_id.name',
		short_name: '$_id.short_name',
		year: '$_id.year',
		//subjects: 1,
		//assessments: '$_id.assessments'
		assessments: 1
	    }
	}
    ];
    
    return performAggregation(res, assessmentsCollection, pipe, true);
});

/*
 * /assessments/:id/stats/bystudent GET
 * 
 * Returns students' stats for assessment with 'id.
 * Students' data can be filtered by group id.
 */
router.get('/:id/stats/bystudent', function(req, res) {
    var pipe = [
	{
            $match: {
                _id: req.params.id
            }
        },
	{
	    $project: {
		grades: 1
	    }
	},
        {
            $unwind: '$grades'
        }
    ];

    if (req.query.group_id != null) {
        var by_group = [
	    {
		$lookup: {
		    from: 'students',
		    localField: 'grades.student_id',
		    foreignField: '_id',
		    as: 'student_data'
		}
	    },
	    {
		$match: {
		    'student_data.enrolments.group_id': req.query.group_id
		}
	    }
	];

	pipe = pipe.concat(by_group);
    }

    var proj = [
	{
            $project: {
                student_id: '$grades.student_id',
                passed: {
                    $filter: {
                        input: '$grades.qualifications',
                        as: 'q',
                        cond: {
                            $gte: [ '$$q.qualification', 5 ]
                        }
                    }
                },
                failed: {
                    $filter: {
                        input: '$grades.qualifications',
                        as: 'q',
                        cond: {
                            $and: [
                                {
                                    $ne: [ '$$q.qualification', null ]
                                },
                                {
                                    $lt: [ '$$q.qualification', 5 ]
                                }
                            ]
                        }
                    }
                },
                avg: {
                    $avg: '$grades.qualifications.qualification'
                }
            }
        },
        {
            $project: {
                student_id: 1,
                passed: {
                    $size: '$passed'
                },
                failed: {
                    $size: '$failed'
                },
                avg: 1
            }
        },
        {
            $project: {
                student_id: 1,
                passed: 1,
                failed: 1,
                sum: {
                    $add: [ '$passed', '$failed' ]
                },
                avg: 1
            }
        },
        {
            $project: {
                student_id: 1,
                passed: 1,
                failed: 1,
                ratio: {
                    $divide: [ '$passed', '$sum' ]
                },
                avg: 1
            }
        },
        {
            $group: {
                _id: '$_id',
                stats: {
                    $push: {
                        student_id: '$student_id',
                        passed: '$passed',
                        failed: '$failed',
                        ratio: '$ratio',
                        avg: '$avg'
                    }
                }
            }
        }
    ];

    pipe = pipe.concat(proj);

    return performAggregation(res, assessmentsCollection, pipe, true);
});

/*
 * /assessments/:id/stats/bysubject GET
 * 
 * Returns subjects' stats for assessment with 'id.
 * Subjects' data can be filtered by group id.
 */
router.get('/:id/stats/bysubject', function(req, res) {
    var pipe = [
        {
            $match: {
                _id: req.params.id
            }
        },
        {
            $project: {
                grades: 1
            }
        },
        {
            $unwind: '$grades'
        }
    ];

    if (req.query.group_id != null) {
        var by_group = [
            {
                $lookup: {
                    from: 'students',
                    localField: 'grades.student_id',
                    foreignField: '_id',
                    as: 'student_data'
                }
            },
            {
                $match: {
                    'student_data.enrolments.group_id': req.query.group_id
                }
            }
        ];

        pipe = pipe.concat(by_group);
    }

    var proj = [
	{
	    $project: {
		student_id: '$grades.student_id',
		qualifications: '$grades.qualifications'
	    }
	},
	{
	    $unwind: '$qualifications'
	},
	{
	    $project: {
		student_id: 1,
		subject_id: '$qualifications.subject_id',
		qualification: '$qualifications.qualification'
	    }
	},
	{
	    $group: {
		_id: {
		    _id:'$_id',
		    subject_id: '$subject_id'
		},
		qualifications: {
		    $push: {
			student_id: '$student_id',
			qualification: '$qualification'
		    }
		}
	    }
	},
	{
	    $project: {
		_id: '$_id._id',
		subject_id: '$_id.subject_id',
		passed: {
                    $filter: {
                        input: '$qualifications',
                        as: 'q',
                        cond: {
                            $gte: [ '$$q.qualification', 5 ]
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
                                    $ne: [ '$$q.qualification', null ]
                                },
                                {
                                    $lt: [ '$$q.qualification', 5 ]
                                }
                            ]
                        }
                    }
                },
                avg: {
                    $avg: '$qualifications.qualification'
                }
            }
        },
	{
            $project: {
                subject_id: 1,
                passed: {
                    $size: '$passed'
                },
                failed: {
                    $size: '$failed'
                },
                avg: 1
            }
        },
	{
            $project: {
                subject_id: 1,
                passed: 1,
                failed: 1,
                sum: {
                    $add: [ '$passed', '$failed' ]
                },
                avg: 1
            }
        },
	{
            $project: {
                subject_id: 1,
                passed: 1,
                failed: 1,
                ratio: {
                    $divide: [ '$passed', '$sum' ]
                },
                avg: 1
            }
        },
	{
            $group: {
                _id: '$_id',
                stats: {
                    $push: {
                        subject_id: '$subject_id',
                        passed: '$passed',
                        failed: '$failed',
                        ratio: '$ratio',
                        avg: '$avg'
                    }
                }
            }
        }
    ];

    pipe = pipe.concat(proj);

    return performAggregation(res, assessmentsCollection, pipe, true);
});

module.exports = router;
