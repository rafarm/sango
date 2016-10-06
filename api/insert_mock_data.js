var mongodb = require('./mongo_connection');

// School data
var school = {_id: 'AS', code: '1234AB', name: 'Awesome School'};

// Subjects
var subjects = [
    {_id: 'BG',   title: 'Biology'},
    {_id: 'FQ',   title: 'Fisics & Quemistry'},
    {_id: 'GH',   title: 'Geography & History'},
    {_id: 'LCL',  title: 'Spanish Language & Literature'},
    {_id: 'AN',   title: 'English'},
    {_id: 'MAC',  title: 'Mathematics for Science'},
    {_id: 'MAP',  title: 'Applied Mathematics'},
    {_id: 'REL',  title: 'Religion'},
    {_id: 'MUS',  title: 'Music'},
    {_id: 'EPVA', title: 'Visual & Artistic Education'},
    {_id: 'VLL',  title: 'Valencian Language & Literature'},
    {_id: 'INF',  title: 'Computer Science'}
];

// Students
var students = [
    {_id: '1',  last_name: 'Jobs',        first_name: 'Steve',   birth_date: new Date(1955, 2, 24)},
    {_id: '2',  last_name: 'Gates',       first_name: 'Bill',    birth_date: new Date(1955, 10, 28)},
    {_id: '3',  last_name: 'Torvalds',    first_name: 'Linus',   birth_date: new Date(1969, 12, 28)},
    {_id: '4',  last_name: 'Berners-Lee', first_name: 'Tim',     birth_date: new Date(1955, 6, 8)},
    {_id: '5',  last_name: 'Stallman',    first_name: 'Richard', birth_date: new Date(1953, 3, 16)},
    {_id: '6',  last_name: 'Brin',        first_name: 'Serguéi', birth_date: new Date(1973, 8, 21)},
    {_id: '7',  last_name: 'Page',        first_name: 'Larry',   birth_date: new Date(1973, 3, 26)},
    {_id: '8',  last_name: 'Ellison',     first_name: 'Larry',   birth_date: new Date(1944, 8, 17)},
    {_id: '9',  last_name: 'Zuckerberg',  first_name: 'Mark',    birth_date: new Date(1984, 5, 14)},
    {_id: '10', last_name: 'Musk',        first_name: 'Elon',    birth_date: new Date(1971, 6, 28)},
    {_id: '11', last_name: 'Bezos',       first_name: 'Jeff',    birth_date: new Date(1964, 1, 12)},
    {_id: '12', last_name: 'Dorsey',      first_name: 'Jack',    birth_date: new Date(1976, 11, 19)}
];

// 2015 assessments and courses
var assessment_session_1_1_15 = {
    _id: '1_1_15',
    name: '1st assessment',
    students: [
        {
            student_id: '1',
            repeater: true,
            qualifications: [
                {subject_id: 'BG',   qualification: 6},
                {subject_id: 'FQ',   qualification: 5},
                {subject_id: 'GH',   qualification: null},
                {subject_id: 'LCL',  qualification: 8},
                {subject_id: 'AN',   qualification: 3},
                {subject_id: 'MAC',  qualification: 4},
                {subject_id: 'MAP',  qualification: null},
                {subject_id: 'REL',  qualification: 7},
                {subject_id: 'MUS',  qualification: 5},
                {subject_id: 'EPVA', qualification: 6},
                {subject_id: 'VLL',  qualification: 8},
                {subject_id: 'INF',  qualification: 5}
            ]
        },
        {
            student_id: '2',
            repeater: false,
            qualifications: [
                {subject_id: 'BG',   qualification: 9},
                {subject_id: 'FQ',   qualification: 8}, 
                {subject_id: 'GH',   qualification: 7},
                {subject_id: 'LCL',  qualification: null},
                {subject_id: 'AN',   qualification: 7},
                {subject_id: 'MAC',  qualification: 9},
                {subject_id: 'MAP',  qualification: 5},
                {subject_id: 'REL',  qualification: 7},
                {subject_id: 'MUS',  qualification: null},
                {subject_id: 'EPVA', qualification: 6}, 
                {subject_id: 'VLL',  qualification: 9}, 
                {subject_id: 'INF',  qualification: 8}
            ]
        },
        {
            student_id: '3',
            repeater: false,
            qualifications: [
                {subject_id: 'BG',   qualification: 10},
                {subject_id: 'FQ',   qualification: 9}, 
                {subject_id: 'GH',   qualification: 10},
                {subject_id: 'LCL',  qualification: null},
                {subject_id: 'AN',   qualification: 8},
                {subject_id: 'MAC',  qualification: 10},
                {subject_id: 'MAP',  qualification: 8},
                {subject_id: 'REL',  qualification: 10},
                {subject_id: 'MUS',  qualification: null},
                {subject_id: 'EPVA', qualification: 9}, 
                {subject_id: 'VLL',  qualification: 8}, 
                {subject_id: 'INF',  qualification:10}
            ]
        },
        {
            student_id: '4',
            repeater: true,
            qualifications: [
                {subject_id: 'BG',   qualification: 4},
                {subject_id: 'FQ',   qualification: 4}, 
                {subject_id: 'GH',   qualification: null},
                {subject_id: 'LCL',  qualification: 6},
                {subject_id: 'AN',   qualification: 4},
                {subject_id: 'MAC',  qualification: 2},
                {subject_id: 'MAP',  qualification: null},
                {subject_id: 'REL',  qualification: 5},
                {subject_id: 'MUS',  qualification: 5},
                {subject_id: 'EPVA', qualification: 4}, 
                {subject_id: 'VLL',  qualification: 3}, 
                {subject_id: 'INF',  qualification: 5}
            ]
        },
        {
            student_id: '5',
            repeter: false,
            qualifications: [
                {subject_id: 'BG',   qualification: 7},
                {subject_id: 'FQ',   qualification: 5}, 
                {subject_id: 'GH',   qualification: 5},
                {subject_id: 'LCL',  qualification: null},
                {subject_id: 'AN',   qualification: 5},
                {subject_id: 'MAC',  qualification: 8},
                {subject_id: 'MAP',  qualification: null},
                {subject_id: 'REL',  qualification: 4},
                {subject_id: 'MUS',  qualification: 5},
                {subject_id: 'EPVA', qualification: 6}, 
                {subject_id: 'VLL',  qualification: 6}, 
                {subject_id: 'INF',  qualification: 4}
            ]
        },
        {
            student_id: '6',
            repeater: false,
            qualifications: [
                {subject_id: 'BG',   qualification: 6},
                {subject_id: 'FQ',   qualification: 3}, 
                {subject_id: 'GH',   qualification: null},
                {subject_id: 'LCL',  qualification: 6},
                {subject_id: 'AN',   qualification: 5},
                {subject_id: 'MAC',  qualification: 3},
                {subject_id: 'MAP',  qualification: null},
                {subject_id: 'REL',  qualification: 6},
                {subject_id: 'MUS',  qualification: 3},
                {subject_id: 'EPVA', qualification: 4}, 
                {subject_id: 'VLL',  qualification: 4}, 
                {subject_id: 'INF',  qualification: 5}
            ]
        }
    ]
};

var assessment_session_1_2_15 = {
    _id: '1_2_15',
    name: '2nd assessment',
    students: [
        {
            student_id: '1',
            repeater: true,
            qualifications: [
                {subject_id: 'BG',   qualification: 8},
                {subject_id: 'FQ',   qualification: 9},
                {subject_id: 'GH',   qualification: 7},
                {subject_id: 'LCL',  qualification: 7},
                {subject_id: 'AN',   qualification: null},
                {subject_id: 'MAC',  qualification: 8},
                {subject_id: 'MAP',  qualification: 9},
                {subject_id: 'REL',  qualification: null},
                {subject_id: 'MUS',  qualification: 7},
                {subject_id: 'EPVA', qualification: 7},
                {subject_id: 'VLL',  qualification: 8},
                {subject_id: 'INF',  qualification: 7}
            ]
        },
	{
            student_id: '2',
            repeater: false,
            qualifications: [
                {subject_id: 'BG',   qualification: 4},
                {subject_id: 'FQ',   qualification: 4},
                {subject_id: 'GH',   qualification: null},
                {subject_id: 'LCL',  qualification: 5},
                {subject_id: 'AN',   qualification: 3},
                {subject_id: 'MAC',  qualification: 6},
                {subject_id: 'MAP',  qualification: 4},
                {subject_id: 'REL',  qualification: null},
                {subject_id: 'MUS',  qualification: 4},
                {subject_id: 'EPVA', qualification: 5},
                {subject_id: 'VLL',  qualification: 4},
                {subject_id: 'INF',  qualification: 5}
            ]
        },
        {
            student_id: '3',
            repeater: false,
            qualifications: [
                {subject_id: 'BG',   qualification: 5},
                {subject_id: 'FQ',   qualification: 5},
                {subject_id: 'GH',   qualification: null},
                {subject_id: 'LCL',  qualification: 5},
                {subject_id: 'AN',   qualification: 5},
                {subject_id: 'MAC',  qualification: 5},
                {subject_id: 'MAP',  qualification: null},
                {subject_id: 'REL',  qualification: 4},
                {subject_id: 'MUS',  qualification: 6},
                {subject_id: 'EPVA', qualification: 7},
                {subject_id: 'VLL',  qualification: 7},
                {subject_id: 'INF',  qualification: 5}
            ]
        },
        {
            student_id: '4',
            repeater: true,
            qualifications: [
                {subject_id: 'BG',   qualification: 8},
                {subject_id: 'FQ',   qualification: 7},
                {subject_id: 'GH',   qualification: 9},
                {subject_id: 'LCL',  qualification: null},
                {subject_id: 'AN',   qualification: 8},
                {subject_id: 'MAC',  qualification: 7},
                {subject_id: 'MAP',  qualification: 5},
                {subject_id: 'REL',  qualification: 8},
                {subject_id: 'MUS',  qualification: null},
                {subject_id: 'EPVA', qualification: 8},
                {subject_id: 'VLL',  qualification: 8},
                {subject_id: 'INF',  qualification: 8}
            ]
        },
        {
            student_id: '5',
            repeater: false,
            qualifications: [
                {subject_id: 'BG',   qualification: 9},
                {subject_id: 'FQ',   qualification: 9},
                {subject_id: 'GH',   qualification: null},
                {subject_id: 'LCL',  qualification: 7},
                {subject_id: 'AN',   qualification: 10},
                {subject_id: 'MAC',  qualification: 10},
                {subject_id: 'MAP',  qualification: 9},
                {subject_id: 'REL',  qualification: null},
                {subject_id: 'MUS',  qualification: 9},
                {subject_id: 'EPVA', qualification: 7},
                {subject_id: 'VLL',  qualification: 10},
                {subject_id: 'INF',  qualification: 9}
            ]
        },
        {
            student_id: '6',
            repeater: false,
            qualifications: [
                {subject_id: 'BG',   qualification: 5},
                {subject_id: 'FQ',   qualification: 4},
                {subject_id: 'GH',   qualification: null},
                {subject_id: 'LCL',  qualification: 5},
                {subject_id: 'AN',   qualification: 5},
                {subject_id: 'MAC',  qualification: 6},
                {subject_id: 'MAP',  qualification: null},
                {subject_id: 'REL',  qualification: 4},
                {subject_id: 'MUS',  qualification: 6},
                {subject_id: 'EPVA', qualification: 5},
                {subject_id: 'VLL',  qualification: 7},
                {subject_id: 'INF',  qualification: 4}
            ]
        }
    ]
};

var course_1_15 = {
    school_id: 'AS',
    start_year: 2015,
    academic_year: '2015-16',
    stage: 'ESO',
    level: '2',
    name: 'C',
    assessments: [
        {assessment_id: assessment_session_1_1_15._id, order: 1},
        {assessment_id: assessment_session_1_2_15._id, order: 2}
    ]
};

var assessment_session_2_1_15 = {
    _id: '2_1_15',
    name: '1st assessment',
    students: [
        {
            student_id: '7',
            repeater: false,
            qualifications: [
                {subject_id: 'BG',   qualification: 8},
                {subject_id: 'FQ',   qualification: 8},
                {subject_id: 'GH',   qualification: 7},
                {subject_id: 'LCL',  qualification: 8},
                {subject_id: 'AN',   qualification: null},
                {subject_id: 'MAC',  qualification: 8},
                {subject_id: 'MAP',  qualification: 7},
                {subject_id: 'REL',  qualification: null},
                {subject_id: 'MUS',  qualification: 5},
                {subject_id: 'EPVA', qualification: 7},
                {subject_id: 'VLL',  qualification: 6},
                {subject_id: 'INF',  qualification: 6}
            ]
        },
        {
            student_id: '8',
            repeater: false,
            qualifications: [
                {subject_id: 'BG',   qualification: 5},
                {subject_id: 'FQ',   qualification: 6},
                {subject_id: 'GH',   qualification: null},
                {subject_id: 'LCL',  qualification: 6},
                {subject_id: 'AN',   qualification: 4},
                {subject_id: 'MAC',  qualification: 8},
                {subject_id: 'MAP',  qualification: 5},
                {subject_id: 'REL',  qualification: null},
                {subject_id: 'MUS',  qualification: 5},
                {subject_id: 'EPVA', qualification: 7},
                {subject_id: 'VLL',  qualification: 6},
                {subject_id: 'INF',  qualification: 6}
            ]
        },
	{
            student_id: '9',
            repeater: true,
            qualifications: [
                {subject_id: 'BG',   qualification: 4},
                {subject_id: 'FQ',   qualification: 5},
                {subject_id: 'GH',   qualification: null},
                {subject_id: 'LCL',  qualification: 5},
                {subject_id: 'AN',   qualification: 5},
                {subject_id: 'MAC',  qualification: 6},
                {subject_id: 'MAP',  qualification: null},
                {subject_id: 'REL',  qualification: 4},
                {subject_id: 'MUS',  qualification: 6},
                {subject_id: 'EPVA', qualification: 5},
                {subject_id: 'VLL',  qualification: 7},
                {subject_id: 'INF',  qualification: 5}
            ]
        },
        {
            student_id: '10',
            repeater: false,
            qualifications: [
                {subject_id: 'BG',   qualification: 7},
                {subject_id: 'FQ',   qualification: 8},
                {subject_id: 'GH',   qualification: 7},
                {subject_id: 'LCL',  qualification: null},
                {subject_id: 'AN',   qualification: 8},
                {subject_id: 'MAC',  qualification: 6},
                {subject_id: 'MAP',  qualification: 7},
                {subject_id: 'REL',  qualification: 7},
                {subject_id: 'MUS',  qualification: null},
                {subject_id: 'EPVA', qualification: 8},
                {subject_id: 'VLL',  qualification: 9},
                {subject_id: 'INF',  qualification: 6}
            ]
        },
        {
            student_id: '11',
            repeater: false,
            qualifications: [
                {subject_id: 'BG',   qualification: 8},
                {subject_id: 'FQ',   qualification: 9},
                {subject_id: 'GH',   qualification: null},
                {subject_id: 'LCL',  qualification: 8},
                {subject_id: 'AN',   qualification: 10},
                {subject_id: 'MAC',  qualification: 10},
                {subject_id: 'MAP',  qualification: 8},
                {subject_id: 'REL',  qualification: null},
                {subject_id: 'MUS',  qualification: 9},
                {subject_id: 'EPVA', qualification: 8},
                {subject_id: 'VLL',  qualification: 10},
                {subject_id: 'INF',  qualification: 8}
            ]
        },
        {
            student_id: '12',
            repeater: false,
            qualifications: [
                {subject_id: 'BG',   qualification: 5},
                {subject_id: 'FQ',   qualification: 6},
                {subject_id: 'GH',   qualification: null},
                {subject_id: 'LCL',  qualification: 4},
                {subject_id: 'AN',   qualification: 5},
                {subject_id: 'MAC',  qualification: 4},
                {subject_id: 'MAP',  qualification: null},
                {subject_id: 'REL',  qualification: 5},
                {subject_id: 'MUS',  qualification: 6},
                {subject_id: 'EPVA', qualification: 5},
                {subject_id: 'VLL',  qualification: 6},
                {subject_id: 'INF',  qualification: 4}
            ]
        }
    ]
};

var assessment_session_2_2_15 = {
    _id: '2_2_15',
    name: '2nd assessment',
    students: [
	{
            student_id: '7',
            repeater: false,
            qualifications: [
                {subject_id: 'BG',   qualification: 8},
                {subject_id: 'FQ',   qualification: 9},
                {subject_id: 'GH',   qualification: 7},
                {subject_id: 'LCL',  qualification: 7},
                {subject_id: 'AN',   qualification: null},
                {subject_id: 'MAC',  qualification: 8},
                {subject_id: 'MAP',  qualification: 9},
                {subject_id: 'REL',  qualification: null},
                {subject_id: 'MUS',  qualification: 7},
                {subject_id: 'EPVA', qualification: 7},
                {subject_id: 'VLL',  qualification: 8},
                {subject_id: 'INF',  qualification: 7}
            ]
        },
        {
            student_id: '8',
            repeater: false,
            qualifications: [
                {subject_id: 'BG',   qualification: 4},
                {subject_id: 'FQ',   qualification: 4},
                {subject_id: 'GH',   qualification: null},
                {subject_id: 'LCL',  qualification: 5},
                {subject_id: 'AN',   qualification: 3},
                {subject_id: 'MAC',  qualification: 6},
                {subject_id: 'MAP',  qualification: 4},
                {subject_id: 'REL',  qualification: null},
                {subject_id: 'MUS',  qualification: 4},
                {subject_id: 'EPVA', qualification: 5},
                {subject_id: 'VLL',  qualification: 4},
                {subject_id: 'INF',  qualification: 5}
            ]
        },
        {
            student_id: '9',
            repeater: true,
            qualifications: [
                {subject_id: 'BG',   qualification: 5},
                {subject_id: 'FQ',   qualification: 5},
                {subject_id: 'GH',   qualification: null},
                {subject_id: 'LCL',  qualification: 5},
                {subject_id: 'AN',   qualification: 5},
                {subject_id: 'MAC',  qualification: 5},
                {subject_id: 'MAP',  qualification: null},
                {subject_id: 'REL',  qualification: 4},
                {subject_id: 'MUS',  qualification: 6},
                {subject_id: 'EPVA', qualification: 7},
                {subject_id: 'VLL',  qualification: 7},
                {subject_id: 'INF',  qualification: 5}
            ]
        },
        {
            student_id: '10',
            repeater: false,
            qualifications: [
                {subject_id: 'BG',   qualification: 8},
                {subject_id: 'FQ',   qualification: 7},
                {subject_id: 'GH',   qualification: 9},
                {subject_id: 'LCL',  qualification: null},
                {subject_id: 'AN',   qualification: 8},
                {subject_id: 'MAC',  qualification: 7},
                {subject_id: 'MAP',  qualification: 5},
                {subject_id: 'REL',  qualification: 8},
                {subject_id: 'MUS',  qualification: null},
                {subject_id: 'EPVA', qualification: 8},
                {subject_id: 'VLL',  qualification: 8},
                {subject_id: 'INF',  qualification: 8}
            ]
        },
        {
            student_id: '11',
            repeater: false,
            qualifications: [
                {subject_id: 'BG',   qualification: 9},
                {subject_id: 'FQ',   qualification: 9},
                {subject_id: 'GH',   qualification: null},
                {subject_id: 'LCL',  qualification: 7},
                {subject_id: 'AN',   qualification: 10},
                {subject_id: 'MAC',  qualification: 10},
                {subject_id: 'MAP',  qualification: 9},
                {subject_id: 'REL',  qualification: null},
                {subject_id: 'MUS',  qualification: 9},
                {subject_id: 'EPVA', qualification: 7},
                {subject_id: 'VLL',  qualification: 10},
                {subject_id: 'INF',  qualification: 9}
            ]
        },
        {
            student_id: '12',
            repeater: false,
            qualifications: [
                {subject_id: 'BG',   qualification: 5},
                {subject_id: 'FQ',   qualification: 4},
                {subject_id: 'GH',   qualification: null},
                {subject_id: 'LCL',  qualification: 5},
                {subject_id: 'AN',   qualification: 5},
                {subject_id: 'MAC',  qualification: 6},
                {subject_id: 'MAP',  qualification: null},
                {subject_id: 'REL',  qualification: 4},
                {subject_id: 'MUS',  qualification: 6},
                {subject_id: 'EPVA', qualification: 5},
                {subject_id: 'VLL',  qualification: 7},
                {subject_id: 'INF',  qualification: 4}
            ]
        }
    ]
};

var course_2_15 = {
    school_id: 'AS',
    start_year: 2015,
    academic_year: '2015-16',
    stage: 'ESO',
    level: '2',
    name: 'A',
    assessments: [
        {assessment_id: assessment_session_2_1_15._id, order: 1},
        {assessment_id: assessment_session_2_2_15._id, order: 2}
    ]
};

// 2016 assessments and courses
var assessment_session_1_1_16 = {
    _id: '1_1_16',
    name: '1st assessment',
    students: [
	{
            student_id: '1',
            repeater: false,
            qualifications: [
                {subject_id: 'BG',   qualification: 5},
                {subject_id: 'FQ',   qualification: 6},
                {subject_id: 'GH',   qualification: null},
                {subject_id: 'LCL',  qualification: 8},
                {subject_id: 'AN',   qualification: 3},
                {subject_id: 'MAC',  qualification: 4},
                {subject_id: 'MAP',  qualification: null},
                {subject_id: 'REL',  qualification: 7},
                {subject_id: 'MUS',  qualification: 5},
                {subject_id: 'EPVA', qualification: 6},
                {subject_id: 'VLL',  qualification: 8},
                {subject_id: 'INF',  qualification: 5}
            ]
        },
	{
            student_id: '7',
            repeater: true,
            qualifications: [
                {subject_id: 'BG',   qualification: 9},
                {subject_id: 'FQ',   qualification: 8},
                {subject_id: 'GH',   qualification: 7},
                {subject_id: 'LCL',  qualification: null},
                {subject_id: 'AN',   qualification: 7},
                {subject_id: 'MAC',  qualification: 9},
                {subject_id: 'MAP',  qualification: 5},
                {subject_id: 'REL',  qualification: 7},
                {subject_id: 'MUS',  qualification: null},
                {subject_id: 'EPVA', qualification: 6},
                {subject_id: 'VLL',  qualification: 9},
                {subject_id: 'INF',  qualification: 8}
            ]
        },
	{
            student_id: '3',
            repeater: false,
            qualifications: [
                {subject_id: 'BG',   qualification: 10},
                {subject_id: 'FQ',   qualification: 9},
                {subject_id: 'GH',   qualification: 10},
                {subject_id: 'LCL',  qualification: null},
                {subject_id: 'AN',   qualification: 8},
                {subject_id: 'MAC',  qualification: 10},
                {subject_id: 'MAP',  qualification: 8},
                {subject_id: 'REL',  qualification: 10},
                {subject_id: 'MUS',  qualification: null},
                {subject_id: 'EPVA', qualification: 9},
                {subject_id: 'VLL',  qualification: 8},
                {subject_id: 'INF',  qualification: 10}
            ]
        },
	{
            student_id: '9',
            repeater: true,
            qualifications: [
                {subject_id: 'BG',   qualification: 4},
                {subject_id: 'FQ',   qualification: 4},
                {subject_id: 'GH',   qualification: null},
                {subject_id: 'LCL',  qualification: 6},
                {subject_id: 'AN',   qualification: 4},
                {subject_id: 'MAC',  qualification: 2},
                {subject_id: 'MAP',  qualification: null},
                {subject_id: 'REL',  qualification: 5},
                {subject_id: 'MUS',  qualification: 5},
                {subject_id: 'EPVA', qualification: 4},
                {subject_id: 'VLL',  qualification: 3},
                {subject_id: 'INF',  qualification: 5}
            ]
        },
	{
            student_id: '5',
            repeater: false,
            qualifications: [
                {subject_id: 'BG',   qualification: 7},
                {subject_id: 'FQ',   qualification: 5},
                {subject_id: 'GH',   qualification: 5},
                {subject_id: 'LCL',  qualification: null},
                {subject_id: 'AN',   qualification: 5},
                {subject_id: 'MAC',  qualification: 8},
                {subject_id: 'MAP',  qualification: null},
                {subject_id: 'REL',  qualification: 4},
                {subject_id: 'MUS',  qualification: 5},
                {subject_id: 'EPVA', qualification: 6},
                {subject_id: 'VLL',  qualification: 6},
                {subject_id: 'INF',  qualification: 4}
            ]
        },
	{
            student_id: '11',
            repeater: false,
            qualifications: [
                {subject_id: 'BG',   qualification: 6},
                {subject_id: 'FQ',   qualification: 3},
                {subject_id: 'GH',   qualification: null},
                {subject_id: 'LCL',  qualification: 6},
                {subject_id: 'AN',   qualification: 5},
                {subject_id: 'MAC',  qualification: 3},
                {subject_id: 'MAP',  qualification: null},
                {subject_id: 'REL',  qualification: 6},
                {subject_id: 'MUS',  qualification: 3},
                {subject_id: 'EPVA', qualification: 4},
                {subject_id: 'VLL',  qualification: 4},
                {subject_id: 'INF',  qualification: 5}
            ]
        }
    ]
};

var assessment_session_1_2_16 = {
    _id: '1_2_16',
    name: '2nd assessment',
    students: [
	{
            student_id: '1',
            repeater: false,
            qualifications: [
                {subject_id: 'BG',   qualification: 8},
                {subject_id: 'FQ',   qualification: 9},
                {subject_id: 'GH',   qualification: 7},
                {subject_id: 'LCL',  qualification: 7},
                {subject_id: 'AN',   qualification: null},
                {subject_id: 'MAC',  qualification: 8},
                {subject_id: 'MAP',  qualification: 9},
                {subject_id: 'REL',  qualification: null},
                {subject_id: 'MUS',  qualification: 7},
                {subject_id: 'EPVA', qualification: 7},
                {subject_id: 'VLL',  qualification: 8},
                {subject_id: 'INF',  qualification: 7}
            ]
        },
	{
            student_id: '7',
            repeater: true,
            qualifications: [
                {subject_id: 'BG',   qualification: 4},
                {subject_id: 'FQ',   qualification: 4},
                {subject_id: 'GH',   qualification: null},
                {subject_id: 'LCL',  qualification: 5},
                {subject_id: 'AN',   qualification: 3},
                {subject_id: 'MAC',  qualification: 6},
                {subject_id: 'MAP',  qualification: 4},
                {subject_id: 'REL',  qualification: null},
                {subject_id: 'MUS',  qualification: 4},
                {subject_id: 'EPVA', qualification: 5},
                {subject_id: 'VLL',  qualification: 4},
                {subject_id: 'INF',  qualification: 5}
            ]
        },
	{
            student_id: '3',
            repeater: false,
            qualifications: [
                {subject_id: 'BG',   qualification: 5},
                {subject_id: 'FQ',   qualification: 5},
                {subject_id: 'GH',   qualification: null},
                {subject_id: 'LCL',  qualification: 5},
                {subject_id: 'AN',   qualification: 5},
                {subject_id: 'MAC',  qualification: 5},
                {subject_id: 'MAP',  qualification: null},
                {subject_id: 'REL',  qualification: 4},
                {subject_id: 'MUS',  qualification: 6},
                {subject_id: 'EPVA', qualification: 7},
                {subject_id: 'VLL',  qualification: 7},
                {subject_id: 'INF',  qualification: 4}
            ]
        },
	{
            student_id: '9',
            repeater: true,
            qualifications: [
                {subject_id: 'BG',   qualification: 8},
                {subject_id: 'FQ',   qualification: 7},
                {subject_id: 'GH',   qualification: 9},
                {subject_id: 'LCL',  qualification: null},
                {subject_id: 'AN',   qualification: 8},
                {subject_id: 'MAC',  qualification: 7},
                {subject_id: 'MAP',  qualification: 5},
                {subject_id: 'REL',  qualification: 8},
                {subject_id: 'MUS',  qualification: null},
                {subject_id: 'EPVA', qualification: 8},
                {subject_id: 'VLL',  qualification: 8},
                {subject_id: 'INF',  qualification: 8}
            ]
        },
	{
            student_id: '5',
            repeater: false,
            qualifications: [
                {subject_id: 'BG',   qualification: 9},
                {subject_id: 'FQ',   qualification: 9},
                {subject_id: 'GH',   qualification: null},
                {subject_id: 'LCL',  qualification: 7},
                {subject_id: 'AN',   qualification: 10},
                {subject_id: 'MAC',  qualification: 10},
                {subject_id: 'MAP',  qualification: 9},
                {subject_id: 'REL',  qualification: null},
                {subject_id: 'MUS',  qualification: 9},
                {subject_id: 'EPVA', qualification: 7},
                {subject_id: 'VLL',  qualification: 10},
                {subject_id: 'INF',  qualification: 9}
            ]
        },
	{
            student_id: '11',
            repeater: false,
            qualifications: [
                {subject_id: 'BG',   qualification: 5},
                {subject_id: 'FQ',   qualification: 4},
                {subject_id: 'GH',   qualification: null},
                {subject_id: 'LCL',  qualification: 5},
                {subject_id: 'AN',   qualification: 5},
                {subject_id: 'MAC',  qualification: 6},
                {subject_id: 'MAP',  qualification: null},
                {subject_id: 'REL',  qualification: 4},
                {subject_id: 'MUS',  qualification: 6},
                {subject_id: 'EPVA', qualification: 5},
                {subject_id: 'VLL',  qualification: 7},
                {subject_id: 'INF',  qualification: 4}
            ]
        }
    ]
};

var course_1_16 = {
    school_id: 'AS',
    start_year: 2016,
    academic_year: '2016-17',
    stage: 'ESO',
    level: '3',
    name: 'C',
    assessments: [
        {assessment_id: assessment_session_1_1_16._id, order: 1},
        {assessment_id: assessment_session_1_2_16._id, order: 2}
    ]
};

var assessment_session_2_1_16 = {
    _id: '2_1_16',
    name: '1st assessment',
    students: [
	{
            student_id: '2',
            repeater: false,
            qualifications: [
                {subject_id: 'BG',   qualification: 8},
                {subject_id: 'FQ',   qualification: 8},
                {subject_id: 'GH',   qualification: 7},
                {subject_id: 'LCL',  qualification: 8},
                {subject_id: 'AN',   qualification: null},
                {subject_id: 'MAC',  qualification: 8},
                {subject_id: 'MAP',  qualification: 7},
                {subject_id: 'REL',  qualification: null},
                {subject_id: 'MUS',  qualification: 5},
                {subject_id: 'EPVA', qualification: 7},
                {subject_id: 'VLL',  qualification: 6},
                {subject_id: 'INF',  qualification: 6}
            ]
        },
	{
            student_id: '8',
            repeater: false,
            qualifications: [
                {subject_id: 'BG',   qualification: 5},
                {subject_id: 'FQ',   qualification: 6},
                {subject_id: 'GH',   qualification: null},
                {subject_id: 'LCL',  qualification: 6},
                {subject_id: 'AN',   qualification: 4},
                {subject_id: 'MAC',  qualification: 8},
                {subject_id: 'MAP',  qualification: 5},
                {subject_id: 'REL',  qualification: null},
                {subject_id: 'MUS',  qualification: 5},
                {subject_id: 'EPVA', qualification: 7},
                {subject_id: 'VLL',  qualification: 6},
                {subject_id: 'INF',  qualification: 6}
            ]
        },
	{
            student_id: '4',
            repeater: true,
            qualifications: [
                {subject_id: 'BG',   qualification: 4},
                {subject_id: 'FQ',   qualification: 5},
                {subject_id: 'GH',   qualification: null},
                {subject_id: 'LCL',  qualification: 5},
                {subject_id: 'AN',   qualification: 5},
                {subject_id: 'MAC',  qualification: 6},
                {subject_id: 'MAP',  qualification: null},
                {subject_id: 'REL',  qualification: 4},
                {subject_id: 'MUS',  qualification: 6},
                {subject_id: 'EPVA', qualification: 6},
                {subject_id: 'VLL',  qualification: 7},
                {subject_id: 'INF',  qualification: 5}
            ]
        },
	{
            student_id: '10',
            repeater: true,
            qualifications: [
                {subject_id: 'BG',   qualification: 7},
                {subject_id: 'FQ',   qualification: 8},
                {subject_id: 'GH',   qualification: 7},
                {subject_id: 'LCL',  qualification: null},
                {subject_id: 'AN',   qualification: 8},
                {subject_id: 'MAC',  qualification: 6},
                {subject_id: 'MAP',  qualification: 7},
                {subject_id: 'REL',  qualification: 7},
                {subject_id: 'MUS',  qualification: null},
                {subject_id: 'EPVA', qualification: 8},
                {subject_id: 'VLL',  qualification: 9},
                {subject_id: 'INF',  qualification: 6}
            ]
        },
	{
            student_id: '6',
            repeater: false,
            qualifications: [
                {subject_id: 'BG',   qualification: 8},
                {subject_id: 'FQ',   qualification: 9},
                {subject_id: 'GH',   qualification: null},
                {subject_id: 'LCL',  qualification: 8},
                {subject_id: 'AN',   qualification: 10},
                {subject_id: 'MAC',  qualification: 10},
                {subject_id: 'MAP',  qualification: 8},
                {subject_id: 'REL',  qualification: null},
                {subject_id: 'MUS',  qualification: 9},
                {subject_id: 'EPVA', qualification: 8},
                {subject_id: 'VLL',  qualification: 10},
                {subject_id: 'INF',  qualification: 8}
            ]
        },
	{
            student_id: '12',
            repeater: true,
            qualifications: [
                {subject_id: 'BG',   qualification: 5},
                {subject_id: 'FQ',   qualification: 6},
                {subject_id: 'GH',   qualification: null},
                {subject_id: 'LCL',  qualification: 4},
                {subject_id: 'AN',   qualification: 5},
                {subject_id: 'MAC',  qualification: 4},
                {subject_id: 'MAP',  qualification: null},
                {subject_id: 'REL',  qualification: 5},
                {subject_id: 'MUS',  qualification: 6},
                {subject_id: 'EPVA', qualification: 5},
                {subject_id: 'VLL',  qualification: 6},
                {subject_id: 'INF',  qualification: 4}
            ]
        }
    ]
};

var assessment_session_2_2_16 = {
    _id: '2_2_16',
    name: '2nd assessment',
    students: [
	{
            student_id: '2',
            repeater: false,
            qualifications: [
                {subject_id: 'BG',   qualification: 8},
                {subject_id: 'FQ',   qualification: 9},
                {subject_id: 'GH',   qualification: 7},
                {subject_id: 'LCL',  qualification: 7},
                {subject_id: 'AN',   qualification: null},
                {subject_id: 'MAC',  qualification: 8},
                {subject_id: 'MAP',  qualification: 9},
                {subject_id: 'REL',  qualification: null},
                {subject_id: 'MUS',  qualification: 7},
                {subject_id: 'EPVA', qualification: 7},
                {subject_id: 'VLL',  qualification: 8},
                {subject_id: 'INF',  qualification: 7}
            ]
        },
	{
            student_id: '8',
            repeater: false,
            qualifications: [
                {subject_id: 'BG',   qualification: 4},
                {subject_id: 'FQ',   qualification: 4},
                {subject_id: 'GH',   qualification: null},
                {subject_id: 'LCL',  qualification: 5},
                {subject_id: 'AN',   qualification: 3},
                {subject_id: 'MAC',  qualification: 6},
                {subject_id: 'MAP',  qualification: 4},
                {subject_id: 'REL',  qualification: null},
                {subject_id: 'MUS',  qualification: 4},
                {subject_id: 'EPVA', qualification: 5},
                {subject_id: 'VLL',  qualification: 4},
                {subject_id: 'INF',  qualification: 5}
            ]
        },
	{
            student_id: '4',
            repeater: true,
            qualifications: [
                {subject_id: 'BG',   qualification: 5},
                {subject_id: 'FQ',   qualification: 5},
                {subject_id: 'GH',   qualification: null},
                {subject_id: 'LCL',  qualification: 5},
                {subject_id: 'AN',   qualification: 5},
                {subject_id: 'MAC',  qualification: 5},
                {subject_id: 'MAP',  qualification: null},
                {subject_id: 'REL',  qualification: 4},
                {subject_id: 'MUS',  qualification: 6},
                {subject_id: 'EPVA', qualification: 7},
                {subject_id: 'VLL',  qualification: 7},
                {subject_id: 'INF',  qualification: 5}
            ]
        },
	{
            student_id: '10',
            repeater: true,
            qualifications: [
                {subject_id: 'BG',   qualification: 8},
                {subject_id: 'FQ',   qualification: 7},
                {subject_id: 'GH',   qualification: 9},
                {subject_id: 'LCL',  qualification: null},
                {subject_id: 'AN',   qualification: 8},
                {subject_id: 'MAC',  qualification: 7},
                {subject_id: 'MAP',  qualification: 5},
                {subject_id: 'REL',  qualification: 8},
                {subject_id: 'MUS',  qualification: null},
                {subject_id: 'EPVA', qualification: 8},
                {subject_id: 'VLL',  qualification: 8},
                {subject_id: 'INF',  qualification: 8}
            ]
        },
	{
            student_id: '6',
            repeater: false,
            qualifications: [
                {subject_id: 'BG',   qualification: 9},
                {subject_id: 'FQ',   qualification: 9},
                {subject_id: 'GH',   qualification: null},
                {subject_id: 'LCL',  qualification: 7},
                {subject_id: 'AN',   qualification: 10},
                {subject_id: 'MAC',  qualification: 10},
                {subject_id: 'MAP',  qualification: 9},
                {subject_id: 'REL',  qualification: null},
                {subject_id: 'MUS',  qualification: 9},
                {subject_id: 'EPVA', qualification: 7},
                {subject_id: 'VLL',  qualification: 10},
                {subject_id: 'INF',  qualification: 9}
            ]
        },
	{
            student_id: '12',
            repeater: true,
            qualifications: [
                {subject_id: 'BG',   qualification: 5},
                {subject_id: 'FQ',   qualification: 4},
                {subject_id: 'GH',   qualification: null},
                {subject_id: 'LCL',  qualification: 5},
                {subject_id: 'AN',   qualification: 5},
                {subject_id: 'MAC',  qualification: 6},
                {subject_id: 'MAP',  qualification: null},
                {subject_id: 'REL',  qualification: 4},
                {subject_id: 'MUS',  qualification: 6},
                {subject_id: 'EPVA', qualification: 5},
                {subject_id: 'VLL',  qualification: 7},
                {subject_id: 'INF',  qualification: 4}
            ]
        }
    ]
};

var course_2_16 = {
    school_id: 'AS',
    start_year: 2016,
    academic_year: '2016-17',
    stage: 'ESO',
    level: '3',
    name: 'A',
    assessments: [
        {assessment_id: assessment_session_2_1_16._id, order: 1},
        {assessment_id: assessment_session_2_2_16._id, order: 2}
    ]
};

function insertCourses() {
    mongodb.db.collection('courses').insertMany([ course_1_15,
						  course_2_15,
						  course_1_16,
						  course_2_16 ])
	.then(function(result) {
	    console.info('Insert courses: ' + result);
            mongodb.db.close();
        })
        .catch(function(error) {
            console.error('Insert courses: ' + error);
	    mongodb.db.close();
        });
}

function insertAssessments() {
    mongodb.db.collection('assessments').insertMany([ assessment_session_1_1_15,
						      assessment_session_1_2_15,
                                                      assessment_session_2_1_15,
						      assessment_session_2_2_15,
                                                      assessment_session_1_1_16,
                                                      assessment_session_1_2_16,
						      assessment_session_2_1_16,
                                                      assessment_session_2_2_16
                                                    ])
	.then(function(result) {
	    console.info('Insert assessments: ' + result);
            insertCourses();
        })
	.catch(function(error) {
	    console.error('Insert assessments: ' + error);
            mongodb.db.close();
        });
}

function insertStudents() {
    mongodb.db.collection('students').insertMany(students)
	.then(function(result) {
            console.info('Insert students: ' + result);
            insertAssessments();
        })
        .catch(function(error) {
	    console.error('Insert students: ' + error);
            mongodb.db.close();
        });
}

function insertSubjects() {
    mongodb.db.collection('subjects').insertMany(subjects)
        .then(function(result) {
            console.info('Insert subjects: ' + result);
            insertStudents();
        })
	.catch(function(error) {
            console.error('Insert subjects: ' + error);
            mongodb.db.close();
        });
}

function insertSchool() {
    mongodb.db.collection('schools').insertOne(school)
        .then(function(result) {
            console.info('Insert school: ' + result);
            insertSubjects();
        })
        .catch(function(err) {
            console.error('Insert school: ' + error);
            mongodb.db.close();
        });
}

function insertData() {
    insertSchool();
}

mongodb.connect
    .then(function () {
	insertData();
    })
    .catch(function (err) {
	// Close server on database connection error.
	console.error(err);
	mongodb.db.close();
    });

