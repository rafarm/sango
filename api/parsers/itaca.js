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
	    // Parse document
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
                    parseChildren(child, processGroup, 'groups', 'cursos_grupo', doc, res);
                    break;
		case 'cursos_grupo':
                    parseChildren(child, processCourseGroup, 'groups', 'alumnos', doc, res);
                    break;
		case 'alumnos':
                    res.sseSend('Processing students...');
                    parseChildren(child, processStudent, 'students', 'medidas_neses', doc, res);
                    break;
		case 'medidas_neses':
                    parseChildren(child, processNese, 'students', 'compensatorias', doc, res);
                    break;
                case 'compensatorias':
                    parseChildren(child, processComp, 'students', 'contenidos_alumno', doc, res);
                    break;
		case 'contenidos_alumno':
                    parseChildren(child, processSubjectStudent, 'students', null, doc, res);
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
	res.sseError('No ' + item.name + ' found in data file');
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

function processCourseGroup(child, doc) {
    if (child.name == 'curso_grupo') {
        var id = doc.attr.codigo + child.attr.grupo + doc.attr.curso;
        var op = {
            updateOne: {
                filter: { _id: id },
                update: { $addToSet: {
                    courses: child.attr.curso
                } }
            }
        };

        return op;
    }

    return null;
}

function processStudent(child, doc) {
    if (child.name == 'alumno') {
	var group = doc.attr.codigo + child.attr.grupo + doc.attr.curso;
        var op = {
            updateOne: {
                filter: { _id: child.attr.NIA, 'enrolments.group_id': { $ne: group } },
                update: { $set: {
                    last_name: child.attr.apellido1 + ' ' + child.attr.apellido2,
                    first_name: child.attr.nombre,
                    birth_date: new Date(child.attr.fecha_nac),
                    gender: child.attr.sexo == 'H' ? 'M' : 'F'
                }, $addToSet: {
		    enrolments: {
			school_id: doc.attr.codigo,
                        year: doc.attr.curso,
			stage_id: child.attr.ensenanza,
			course_id: child.attr.curso,
			group_id: group,
			active: child.attr.estado_matricula == 'M',
			repeats: child.attr.repite != '0'
		    }
		} },
                upsert: true
            }
        };

        return op;
    }

    return null;
}

function processNese(child, doc) {
    return processEdMeasure(child, 'medida_nese', doc);
}

function processComp(child, doc) {
    return processEdMeasure(child, 'compensatoria', doc);
}

function processEdMeasure(child, name, doc) {
    if (child.name == name) {
        var measure = getEdMeasure(child.attr.medida_educativa, doc);

        if (measure != null) {
            var op = {
                updateOne: {
                    filter: {
                        _id: child.attr.alumno,
                        'enrolments.school_id': doc.attr.codigo,
                        'enrolments.year': doc.attr.curso
                    },
                    update: { $addToSet: {
                        'enrolments.$.ed_measures': measure
                    } }
                }
            };

            return op;
        }
    }

    return null;
}

function getEdMeasure(m_id, doc) {
    var measures = doc.childNamed('medidas_educativas');
    var m = measures.childWithAttribute('codigo', m_id);

    if (m != undefined) {
    	return m.attr.nombre_val;
    }

    return null;
}

function processSubjectStudent(child, doc) {
    if (child.name == 'contenido_alumno' && child.attr.curso_pendiente == ' ') {
        var op = {
            updateOne: {
                filter: {
                    _id: child.attr.alumno,
                    'enrolments.school_id': doc.attr.codigo,
                    'enrolments.year': doc.attr.curso
                },
                update: { $addToSet: {
                    'enrolments.$.subjects': {
                        subject_id: child.attr.contenido,
			adapted: child.attr.acis == 'S'
		    }
                } }
            }
        };

        return op;
    }

    return null;
}

module.exports = parser;
