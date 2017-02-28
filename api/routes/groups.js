var express = require('express');
var router = express.Router();
var mongodb = require('../mongo_connection');
var groupsCollection = mongodb.db.collection('groups');
var bodyParser = require('body-parser');
var wrapResult = require('./wrap-result').wrapResult;

/*
 * /groups/tree/years GET
 *
 * Returns the years with groups. Used to construct
 * group selector tree.
 */
router.get('/tree/years', (req, res) => {
    var pipe = [
        {
            $group: {
                _id: '$year'            
            }
        }
    ];

    
    groupsCollection.aggregate(pipe, (err, result) => {
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
 * /groups/tree/:year/courses GET
 *
 * Returns the courses of 'year' grouped by stage and parent course.
 * Used to construct group selector tree.
 */
router.get('/tree/:year/courses', (req, res) => {
var pipe = [
        {
            $match: {
                year: req.params.year
            }
        },
        {
            $unwind: '$courses'
        },
        {
            $project: {
                _id: '$courses'
            }
        },
        {
            $lookup: {
                from: 'courses',
                localField: '_id',
                foreignField: '_id',
                as: 'course'
            }
        },
        {
            $unwind: '$course'
        },
	{
	    $project: {
		stage_id: '$course.stage_id',
		name: '$course.short_name',
		parent_id: '$course.parent_id'
	    }
	},
	{
            $lookup: {
                from: 'stages',
                localField: 'stage_id',
                foreignField: '_id',
                as: 'stage'
            }
        },
        {
            $unwind: '$stage'
        },
	{
	    $project: {
		name: 1,
		parent_id: 1,
		stage: '$stage.short_name'
	    }
	},
	{
	    $lookup: {
		from: 'courses',
		localField: 'parent_id',
		foreignField: '_id',
		as: 'parent'
	    }
	},
	{
	    $unwind: {
		path: '$parent',
		preserveNullAndEmptyArrays: true
	    }
	},
	{
	    $project: {
		name: 1,
		stage: 1,
		parent: '$parent.name'
	    }
	},
	{
	    $sort: {
		name: -1
	    }
	},
	{
	    $group: {
		_id: {
		    stage: '$stage',
		    parent: '$parent'
		},
		courses: {
		    $addToSet: {
			_id: '$_id',
			name: '$name'
		    }
		}
	    }
	},
	{
	    $sort: {
		'_id.stage': 1,
		'_id.parent': 1
	    }
	}
    ];

    groupsCollection.aggregate(pipe, (err, result) => {
        if (err != null) {
            res.status(500);
            res.json(err);
        }
        else {
            res.json(wrapResult(result));
        }
    });
});

module.exports = router;