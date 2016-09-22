var mongodb = require('./mongo_connection');
var ObjectID = require('mongodb').ObjectID;

var students = [
	{_id: '1', last_name: 'Jobs', first_name: 'Steve', birth_date: new Date(1955, 2, 24)},
	{_id: '2', last_name: 'Gates', first_name: 'Bill', birth_date: new Date(1955, 10, 28)},
	{_id: '3', last_name: 'Torvalds', first_name: 'Linus', birth_date: new Date(1969, 12, 28)},
	{_id: '4', last_name: 'Berners-Lee', first_name: 'Tim', birth_date: new Date(1955, 6, 8)},
	{_id: '5', last_name: 'Stallman', first_name: 'Richard', birth_date: new Date(1953, 3, 16)},
	{_id: '6', last_name: 'Brin', first_name: 'Serguéi', birth_date: new Date(1973, 8, 21)},
	{_id: '7', last_name: 'Page', first_name: 'Larry', birth_date: new Date(1973, 3, 26)},
	{_id: '8', last_name: 'Ellison', first_name: 'Larry', birth_date: new Date(1944, 8, 17)},
	{_id: '9', last_name: 'Zuckerberg', first_name: 'Mark', birth_date: new Date(1984, 5, 14)},
	{_id: '10', last_name: 'Musk', first_name: 'Elon', birth_date: new Date(1971, 6, 28)},
	{_id: '11', last_name: 'Bezos', first_name: 'Jeff', birth_date: new Date(1964, 1, 12)},
	{_id: '12', last_name: 'Dorsey', first_name: 'Jack', birth_date: new Date(1976, 11, 19)}
];

var assessment_session_1 = {
	order: '1',
	name: '1st assessment',
	students_qualifications: [
		{student_id: '1', qualifications: [6, 5, null, 8, 3, 4, null, 7, 5, 6, 8, 5]},
		{student_id: '2', qualifications: [9, 8, 7, null, 7, 9, 5, 7, null, 6, 9, 8]},
		{student_id: '3', qualifications: [10, 9, 10, null, 8, 10, 8, 10, null, 9, 8, 10]},
		{student_id: '4', qualifications: [4, 4, null, 6, 4, 2, null, 5, 5, 4, 3, 5]},
		{student_id: '5', qualifications: [7, 5, 5, null, 5, 8, null, 4, 5, 6, 6, 4]},
		{student_id: '6', qualifications: [6, 3, null, 6, 5, 3, null, 6, 3, 4, 4, 5]},
		{student_id: '7', qualifications: [8, 8, 7, 8, null, 8, 7, null, 5, 7, 6, 6]},
		{student_id: '8', qualifications: [5, 6, null, 6, 4, 8, 5, null, 5, 7, 6, 6]},
		{student_id: '9', qualifications: [4, 5, null, 5, 5, 6, null, 4, 6, 6, 7, 5]},
		{student_id: '10', qualifications: [7, 8, 7, null, 8, 6, 7, 7, null, 8, 9, 6]},
		{student_id: '11', qualifications: [8, 9, null, 8, 10, 10, 8, null, 9, 8, 10, 8]},
		{student_id: '12', qualifications: [5, 6, null, 4, 5, 4, null, 5, 6, 5, 6, 4]}
	]
};

var assessment_session_2 = {
	order: '2',
	name: '2nd assessment',
	students_qualifications: [
		{student_id: '1', qualifications: [5, 5, null, 6, 3, 4, null, 4, 4, 5, 7, 6]},
		{student_id: '2', qualifications: [10, 8, 9, null, 9, 10, 6, 6, null, 7, 8, 9]},
		{student_id: '3', qualifications: [10, 8, 10, null, 9, 9, 9, 10, null, 9, 9, 10]},
		{student_id: '4', qualifications: [3, 4, null, 7, 4, 3, null, 4, 5, 5, 3, 4]},
		{student_id: '5', qualifications: [8, 4, 7, null, 5, 7, null, 5, 4, 7, 6, 5]},
		{student_id: '6', qualifications: [7, 3, null, 5, 5, 4, null, 6, 4, 4, 5, 5]},
		{student_id: '7', qualifications: [8, 9, 7, 7, null, 8, 9, null, 7, 7, 8, 7]},
		{student_id: '8', qualifications: [4, 4, null, 5, 3, 6, 4, null, 4, 5, 4, 5]},
		{student_id: '9', qualifications: [5, 5, null, 5, 5, 5, null, 4, 6, 7, 7, 5]},
		{student_id: '10', qualifications: [8, 7, 9, null, 8, 7, 5, 8, null, 8, 8, 8]},
		{student_id: '11', qualifications: [9, 9, null, 7, 10, 10, 9, null, 9, 7, 10, 9]},
		{student_id: '12', qualifications: [5, 4, null, 5, 5, 6, null, 4, 6, 5, 7, 4]}
	]
};

var course = {
	start_year: 2016,
	academic_year: '2016-17',
	stage: 'ESO',
	level: '3',
	name: 'C',
	repeaters: ['1', '4', '9'],
	subjects_id: ['BG', 'FQ', 'GH', 'LCL', 'AN', 'MAC', 'MAP', 'REL', 'MUS', 'EPVA', 'VLL', 'INF'],
	subjects_name: ['Biologia', 'Física i Química', 'Geografia', 'Llengua Castellana i Literatura', 'Anglès', 'Matemàtiques Científiques', 'Matemàtiques Aplicades', 'Religió', 'Música', 'Educació Plàstica i Visual', 'Valencià Llengua i Literatura', 'Informàtica'],
	assessment_sessions: [assessment_session_1, assessment_session_2]
};

mongodb.connect
	.then(function () {
		// Insert students
		var studentsCollection = mongodb.db.collection('students');
		studentsCollection.insertMany(students, null)
			.then(function(result) {
				console.info('Insert students: ' + result);
				
				// Insert course
				var coursesCollection = mongodb.db.collection('courses');
				coursesCollection.insertOne(course, null)
					.then(function(result) {
						console.info('Insert course: ' + result);
						mongodb.db.close();
					})
					.catch(function(err) {
						console.error('Insert course: ' + err);
						mongodb.db.close();
					});
			})
			.catch(function(err) {
				console.error('Insert students: ' + err);
				mongodb.db.close();
			});
	})
	.catch(function (err) {
		// Close server on database connection error.
		console.error(err);
		server.close();
	});

