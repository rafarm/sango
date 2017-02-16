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
function parseDoc(doc, childName, res) {
    if (childName != null) {
    	var child = doc.childNamed(childName);
    
    	if (child != undefined) {
	    switch (child.name) {
                case 'ensenanzas':
		    res.sseSend('Processing stages...');
                    parseChildren(child, processStage, 'stages', 'cursos', doc, res);
                    break;
                case 'cursos':
                    res.sseSend('Processing courses...');
                    parseChildren(child, processCourse, 'courses', 'contenidos', doc, res);
                    break;
	        case 'contenidos':
                    res.sseSend('Processing subjects...');
                    parseChildren(child, processSubject, 'subjects', 'grupos', doc, res);
                    break;
		case 'grupos':
                    res.sseSend('Processing groups...');
                    parseChildren(child, processGroup, 'groups', null, doc, res);
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

function parseChildren(item, process, collection, next, doc, res) {
    var operations = [];

    for (var i=0; i<item.children.length; i++) {
        var child = item.children[i];

	var op = process(child, doc);
	if (op != null) {
	    operations.push(op);
	}
    }

    if (operations.length > 0) {
	mongodb.db.collection(collection).bulkWrite(operations)
	    .then(resp => {
		parseDoc(doc, next, res);
	    })
	    .catch(error => {
		res.sseError(error);
	    });
    }
    else {
	res.sseError('No ' + collection + ' found in data file');
    }
}

function processStage(child, doc) {
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

function processCourse(child, doc) {
    if (child.name == 'curso') {
        var op = {
            updateOne: {
                filter: { _id: child.attr.codigo },
                update: { $set: {
                    stage_id: child.attr.ensenanza,
                    name: child.attr.nombre_val,
                    short_name: child.attr.abreviatura,
                    parent_id: child.attr.padre
                } },
                upsert: true
            }
        };

        return op;
    }

    return null;
}

function processSubject(child, doc) {
    if (child.name == 'contenido') {
        var op = {
            updateOne: {
                filter: { _id: child.attr.codigo },
                update: { $set: {
                    name: child.attr.nombre_val,
                    stage_id: child.attr.ensenanza,
                    course_id: child.attr.curso
                } },
                upsert: true 
            }
        };

        return op;
    }

    return null;
}

function processGroup(child, doc) {
    if (child.name == 'grupo') {
	var id = doc.attr.codigo + child.attr.codigo + doc.attr.curso;
        var op = {
            updateOne: {
                filter: { _id: id },
                update: { $set: {
                    short_name: child.attr.codigo,
		    school_id: doc.attr.codigo,
		    year: doc.attr.curso,
		    name: child.attr.nombre,
                    stage_id: child.attr.ensenanza,
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

module.exports = parser;
