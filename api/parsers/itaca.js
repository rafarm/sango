var mongodb = require('../mongo_connection');
var xmldoc = require('xmldoc');

function parser(req, res) {
    console.log('Ingest - parse init: '+ req.file.originalname);
    if (req.file.mimetype != 'text/xml') {
	responseError('Not an xml file.', res);
	return;
    }
    
    var doc = new xmldoc.XmlDocument(req.file.buffer);
    if (doc.name != 'centro') {
        responseError('Invalid file format.', res);
	return;
    }

    // Insert school data...
    mongodb.db.collection('schools').updateOne(
	{_id: doc.attr.codigo },
	{ $set: { name: doc.attr.denominacion } },
	{ upsert: true })
	.then(function(result) {
	    parseDoc(doc, 0, {}, res);
	})
	.catch(function(error) {
	    res.status(500);
	    res.json(error);	    
	});
}

function responseError(msg, res) {
    res.status(500);
    res.json({msg: msg});
}

function parseDoc(doc, index, result, res) {
    if (index < doc.children.length) {
	var child = doc.children[index];

	switch (child.name) {
	    case 'contenidos':
		parseSubjects(child, doc, index, result, res);
		break;
	    default: // Continue...
		parseDoc(doc, ++index, result, res);
	}
    }

    res.json(result);
}

function parseSubjects(subjects, doc, index, result, res) {
    var operations = [];

    for (var s=0; s<subjects.children.length; s++) {
	var sub = subjects.children[s];

	if (sub.name != 'contenido') {
	    responseError('Invalid file format.', res);
	    return;
	}

	var op = {
	    updateOne: {
		filter: { _id: sub.attr.codigo },
		update: { $set: {
		    level: sub.attr.ensenanza,
		    name: sub.attr.nombre_val
		} },
		upsert: true 
	    }
	};

	operations.push(op);
    }

     mongodb.db.collection('subjects').bulkWrite(operations)
	.then(function(resp) {
	    result['subjects'] = resp;
            parseDoc(doc, ++index, result, res);
        })
        .catch(function(error) {
            res.status(500);
            res.json(error);
        });
}

module.exports = parser;
