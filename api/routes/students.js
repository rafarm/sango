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
    var filter = null;
    if (req.query.ids != null) {
	filter = { _id: { $in: req.query.ids } };
    }
    //var order = { last_name: 1, first_name: 1 };

    studentsCollection.find(filter)/*.sort(order)*/.toArray()
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

/*
 * /students/bygroup/:id/:year GET
 * 
 * Returns the ACTIVE students corresponding to group with 'id'
 * for the group's 'year'.
 * Group data are also included.
 */
router.get('/bygroup/:id/:year', function(req, res) {
    var pipe = [
	{$match:{enrolments:{$elemMatch: {year:'2016',group_id:'120056011BAHB2016',active: true}}}},{$unwind:'$enrolments'},{$project:{first_name: 1,last_name: 1,birth_date: 1,gender: 1,repeats:'$enrolments.repeats',ed_measures:'$enrolments.ed_measures',year:'$enrolments.year',group_id:'$enrolments.group_id',course_id:'$enrolments.course_id',student_subjects:'$enrolments.subjects',subject_id:'$enrolments.subjects.subject_id'}},{$lookup:{from:'groups',localField:'group_id',foreignField:'_id',as:'group'}},{$unwind:'$group'},{$unwind:'$subject_id'},{$lookup:{from:'subjects',localField:'subject_id',foreignField:'_id',as:'course_subjects'}},{$unwind:'$course_subjects'},{$group:{_id:{_id:'$group_id',name:'$group.name',short_name:'$group.short_name',year:'$year',course_id:'$course_id'},subjects:{$addToSet:{_id:'$course_subjects._id',name:'$course_subjects.name'}},students:{$addToSet:{_id:'$_id',first_name:'$first_name',last_name:'$last_name',birthdate:'$birth_date',gender:'$gender',repeats:'$repeats',ed_measures:'$ed_measures',subjects:'$student_subjects'}}}},{$project:{_id:'$_id._id',name:'$_id.name',short_name:'$_id.short_name',year:'$_id.year',course_id:'$_id.course_id',subjects:1,students:1}},{$unwind:'$subjects'},{$sort:{'subjects.name':1}},{$group:{_id:{_id:'$_id',name:'$name',short_name:'$short_name',year:'$year',course_id:'$course_id',students:'$students'},subjects:{$push:{_id:'$subjects._id',name:'$subjects.name'}}}}
    ];

    studentsCollection.aggregate(pipe, function(err, result) {
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
