var mongodb = require('../mongo_connection');
var xmldoc = require('xmldoc');
var fs = require('fs');
var path = process.env.npm_package_config_upload_path;

function parser(req, res) {
    // Open file
    try {
        var buffer = fs.readFileSync(path + '/' + req.params.name);
    }
    catch(err) {
        res.sseError(err.message);
	return;
    }
    res.sseSend('Processing file...');
    
    // Parse XML data
    try {
        var doc = new xmldoc.XmlDocument(buffer);
    }
    catch(err) {
        res.sseError('Invalid XML file.');
	return;
    }

    // Init file processing
    if (doc.name != 'centro') {
        res.sseError('Invalid file format.');
	return;
    }
    
    // Insert school data...
    mongodb.db.collection('schools').updateOne(
	{_id: doc.attr.codigo },
	{ $set: { name: doc.attr.denominacion } },
	{ upsert: true })
	.then(result => {
	    //parseDoc(doc, 0, {}, res);
            parseDoc(doc, 'ensenanzas', res);
	})
	.catch(error => {
	    res.sseError(error);	    
	});
}

// Use recursion to parse data file...
function parseDoc(doc, childName,  res) {
    if (childName != null) {
    	var child = doc.childNamed(childName);
    
    	if (child != undefined) {
	    switch (child.name) {
                case 'ensenanzas':
		    res.sseSend('Processing stages...');
                    parseStages(child, doc, res);
                    break;
                default: // Error...
                    res.sseError('"' + childName + '" entity data not processed.');
            }
        }
	else {
	    res.sseError('"' + childName + '" entity not found in data file.');
	}
    }
    else {
	res.sseEnd('OK');
    }
}

function parseStages(item, doc, res) {
    var operations = [];

    for (var i=0; i<item.children.length; i++) {
        var child = item.children[i];

	var op = processStage(child);
	if (op != null) {
	    operations.push(op);
	}
    }

    if (operations.length > 0) {
	mongodb.db.collection('stages').bulkWrite(operations)
	    .then(resp => {
		parseDoc(doc, null, res);
	    })
	    .catch(error => {
		res.sseError(error);
	    });
    }
    else {
	res.sseError('No stages found in data file');
    }
}

function parseChildren(item, process, collection, doc, res) {
    var operations = [];

    for (var i=0; i<item.children.length; i++) {
        var c = item.children[i];
	operations.push(process(c, doc));
    }

    mongodb.db.collection(collection).bulkWrite(operations)
        .then(function(resp) {
            //result[collection] = resp.nInserted + resp.nUpserted + resp.nMatched;
            parseDoc(doc, ++index, result, res);
        })
        .catch(function(error) {
            res.status(500);
            res.json(error);
        });
}

function processStage(child) {
    if (child.name == 'ensenanza') {
        var op = {
            updateOne: {
                filter: { _id: child.attr.ensenanza },
                update: { $set: {
                    name: child.attr.nombre_val,
                    short_name: child.attr.abreviatura
                } },
                upsert: true
            }
        };

        return op;
    }

    return null;
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
