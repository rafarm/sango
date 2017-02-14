var mongodb = require('../mongo_connection');
var xmldoc = require('xmldoc');
var fs = require('fs');
var path = process.env.npm_package_config_upload_path;

function parser(req, res) {
    /*
    console.log('Ingest - parse init: '+ req.params.name);
    
    if (req.file.mimetype != 'text/xml') {
        res.status(500);
        responseError('Not an xml file.', res);
        return;
    }
    */

    var buffer = fs.readFile(path + '/' + req.params.name);
    setupEvents(res);
    sendEvent(res, "File read...");
    /*
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
    */
}

function setupEvents(res) {
    res.writeHead(200, {
	'Content-Type': 'text/event-stream',
	'Cache-Control': 'no-cache',
	'Connection': 'keep-alive'
    });
}

function sendEvent(res, data) {
    res.write("data: " + data + "\n\n");
}

function responseError(msg, res) {
    res.status(500);
    res.send(msg);
}

function parseDoc(doc, index, result, res) {
    if (index < doc.children.length) {
	var child = doc.children[index];

	switch (child.name) {
	    case 'contenidos':
                parseChildren(child, processSubject, 'subjects', doc, index, result, res);
		//parseSubjects(child, doc, index, result, res);
		break;
	    case 'alumnos':
                parseChildren(child, processStudent, 'students', doc, index, result, res);
		//parseStudents(child, doc, index, result, res);
		break;
	    default: // Continue...
		parseDoc(doc, ++index, result, res);
	}
    }
    else {
        res.json(result);
    }
}

function parseChildren(item, process, collection, doc, index, result, res) {
    var operations = [];

    for (var i=0; i<item.children.length; i++) {
        var c = item.children[i];
	operations.push(process(c, doc));
    }

    mongodb.db.collection(collection).bulkWrite(operations)
        .then(function(resp) {
            result[collection] = resp.nInserted + resp.nUpserted + resp.nMatched;
            parseDoc(doc, ++index, result, res);
        })
        .catch(function(error) {
            res.status(500);
            res.json(error);
        });
}

function processSubject(sub, doc) {
    if (sub.name == 'contenido') {
        var op = {
            updateOne: {
                filter: { _id: sub.attr.codigo },
                update: { $set: {
                    level: sub.attr.ensenanza,
                    name: sub.attr.nombre_val,
                    school_id: doc.attr.codigo
                } },
                upsert: true 
            }
        };

        return op;
    }

    return null;
}

function processStudent(st, doc) {
    if (st.name == 'alumno') {
        var op = {
            updateOne: {
                filter: { _id: st.attr.NIA },
                update: { $set: {
                    last_name: st.attr.apellido1 + ' ' + st.attr.apellido2,
                    first_name: st.attr.nombre,
                    birth_date: new Date(st.attr.fecha_nac),
                    gender: st.attr.sexo == 'H' ? 'M' : 'F',
                    school_id: doc.attr.codigo
                } },
                upsert: true
            }
        };

        return op;
    }

    return null;
}

/*
function parseSubjects(subjects, doc, index, result, res) {
    var operations = [];

    for (var s=0; s<subjects.children.length; s++) {
	var sub = subjects.children[s];

	if (sub.name == 'contenido') {
	    var op = {
	        updateOne: {
		    filter: { _id: sub.attr.codigo },
		    update: { $set: {
		        level: sub.attr.ensenanza,
		        name: sub.attr.nombre_val,
		        school_id: doc.attr.codigo
		    } },
		    upsert: true 
	    	}
	    };

	    operations.push(op);
	}
    }

    mongodb.db.collection('subjects').bulkWrite(operations)
	.then(function(resp) {
	    result['subjects'] = resp.nUpserted;
            parseDoc(doc, ++index, result, res);
        })
        .catch(function(error) {
            res.status(500);
            res.json(error);
        });
}

function parseStudents(students, doc, index, result, res) {
    var operations = [];

    for (var s=0; s<students.children.length; s++) {
        var st = students.children[s];

        if (st.name == 'alumno') {
            var op = {
                updateOne: {
                    filter: { _id: st.attr.NIA },
                    update: { $set: {
                        last_name: st.attr.apellido1 + ' ' + st.attr.apellido2,
                        first_name: st.attr.nombre,
			birth_date: st.attr.fecha_nac,
			genre: st.attr.sexo,
                        school_id: doc.attr.codigo
                    } },
                    upsert: true
                }
            };

            operations.push(op);
        }
    }

    mongodb.db.collection('students').bulkWrite(operations)
        .then(function(resp) {
            result['students'] = resp.nUpserted;
            parseDoc(doc, ++index, result, res);
        })
        .catch(function(error) {
            res.status(500);
            res.json(error);
        });
}
*/

module.exports = parser;
