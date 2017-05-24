var express = require('express');
var router = express.Router();
var mongodb = require('../mongo_connection');
var studentsCollection = mongodb.db.collection('students');
var bodyParser = require('body-parser');
var wrapResult = require('./wrap-result').wrapResult;
var collation = { locale: process.env.npm_package_config_locale };

/*
 * /students GET
 * 
 * Returns all students in query array or all students
 * if there's no query array.
 */
/*
router.get('/', function(req, res) {
    var filter = null;
    if (req.query.ids != null) {
	filter = { _id: { $in: req.query.ids } };
    }
    //var order = { last_name: 1, first_name: 1 };

    studentsCollection.find(filter).toArray()
	.then(function(students) {
	    res.json(wrapResult(students));
	})
	.catch(function(err) {
	    res.status(500);
	    res.json(err);
	});
});
*/

/*
 * /students/:id GET
 * 
 * Returns the student identified by 'id'.
 */
/*
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
*/

/*
 * /students POST
 * 
 * Inserts a new student.
 */
/*
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
*/

/*
 * /students/many POST
 * 
 * Inserts an array of new students.
 */
/*
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
*/

/*
 * /students/bygroup/:id/:year GET
 * 
 * Returns the ACTIVE students corresponding to group with 'id'
 * <!--for the group's 'year'-->.
 * Group data are also included.
 */
//router.get('/bygroup/:id/:year', function(req, res) {
router.get('/bygroup/:id', function(req, res) {
  var pipe = [
    {
      $match: {
        enrolments: {
          $elemMatch: {
            //year: req.params.year,
            group_id: req.params.id,
            active: true
          }
        }
      }
    },
    {
      $unwind: '$enrolments'
    },
    {
      $match: {
        //'enrolments.year': req.params.year,
        'enrolments.group_id': req.params.id
      }
    },
    {
      $project: {
        first_name: 1,
        last_name: 1,
        birth_date: 1,
        gender: 1,
        repeats: '$enrolments.repeats',
        ed_measures: '$enrolments.ed_measures',
        year: '$enrolments.year',
        group_id: '$enrolments.group_id',
        course_id: '$enrolments.course_id',
        course_subjects: '$enrolments.subjects',
        student_subjects: '$enrolments.subjects'
      }
    },
    {
      $unwind: '$course_subjects'
    },
    {
      $lookup: {
        from: 'subjects',
        localField: 'course_subjects.subject_id',
        foreignField: '_id',
        as: 'subjects'
      }
    },
    {
      $unwind: '$subjects'
    },
    {
      $group: {
        _id: {
          _id: '$group_id',
          course_id: '$course_id',
          year: '$year'
        },
        subjects: {
          $addToSet: {
            _id: '$subjects._id',
            name: '$subjects.name'
          }
        },
        students: {
          $addToSet: {
            _id: '$_id',
            first_name: '$first_name',
            last_name: '$last_name',
            birthdate: '$birth_date',
            gender: '$gender',
            repeats: '$repeats',
            ed_measures: '$ed_measures',
            subjects: '$student_subjects'
          }
        }
      }
    },
    {
      $project: {
        _id: '$_id._id',
        course_id: '$_id.course_id',
        year: '$_id.year',
        subjects: 1,
        students: 1
      }
    },
    {
      $unwind: '$subjects'
    },
    {
      $sort: {
        'subjects._id': 1
      }
    },
    {
      $group: {
        _id: {
          _id: '$_id',
          course_id: '$course_id',
          year: '$year',
          students: '$students'
        },
        subjects: {
          $push: {
            _id: '$subjects._id',
            name: '$subjects.name'
          }
        }
      }
    },
    {
      $project: {
        _id: '$_id._id',
        course_id: '$_id.course_id',
        year: '$_id.year',
        students: '$_id.students',
        subjects: 1
      }
    },
    {
      $unwind: '$students'
    },
    {
      $sort: {
        'students.last_name': 1,
        'students.first_name': 1
      }
    },
    {
      $group: {
        _id: {
          _id: '$_id',
          course_id: '$course_id',
          year: '$year',
          subjects: '$subjects'
        },
        students: {
          $push: {
            _id: '$students._id',
            first_name: '$students.first_name',
            last_name: '$students.last_name',
            birthdate: '$students.birthdate',
            gender: '$students.gender',
            repeats: '$students.repeat',
            ed_measures: '$students.ed_measures',
            subjects: '$students.subjects'
          }
        }
      }
    },
    {
      $project: {
        _id: '$_id._id',
        course_id: '$_id.course_id',
        year: '$_id.year',
        subjects: '$_id.subjects',
        students:1
      }
    },
    {
      $lookup: {
        from: 'groups',
        localField: '_id',
        foreignField: '_id',
        as: 'group'
      }
    },
    {
      $unwind: '$group'
    },
    {
      $project: {
        name: '$group.name',
        short_name: '$group.short_name',
        year: 1,
        course_id: 1,
        subjects: 1,
        students: 1
      }
    }
  ];

  studentsCollection.aggregate(pipe, { collation: collation }, function(err, result) {
    if (err != null) {
      res.status(500);
      res.json(err);
    }
    else {
      result = result.length > 0 ? result[0] : result;
      res.json(wrapResult(result));
    }
  });
});

module.exports = router;
