var Rx = require('rxjs/Rx');
var mongodb = require('../mongo_connection');
var xmldoc = require('xmldoc');
var fs = require('fs');
var path = process.env.npm_package_config_upload_path;

const excluded_content = "Tutoria";


function parser(req, res) {
// Synchronous processing...
    // Open file
    try {
        var buffer = fs.readFileSync(path + '/' + req.params.name);
    }
    catch(err) {
        res.sseError(err.message);
	return;
    }
    res.sseSend('Processant el fitxer...');
    
    // Parse XML data
    try {
        var doc = new xmldoc.XmlDocument(buffer);
    }
    catch(err) {
        res.sseError('Fitxer XML invàlid.');
	return;
    }

    // Init file processing
    if (doc.name != 'centro') {
        res.sseError('Format de fitxer invàlid.');
	return;
    }
    
// Asynchronous processing...
    var opObservables = schoolData(doc);

    opObservables = opObservables.concat(
	parseChildren(
            'ensenanzas',
	    processStage,
	    'stages',
	    'Processant Etapes...',
	    doc)
    );
    opObservables = opObservables.concat(
        parseChildren(
            'cursos',
            processCourse,
            'courses',
            'Processant Cursos...',
            doc)
    );
    opObservables = opObservables.concat(
        parseChildren(
            'contenidos',
            processSubject,
            'subjects',
            'Processant Continguts...',
            doc)
    );
    opObservables = opObservables.concat(
        parseChildren(
            'grupos',
            processGroup,
            'groups',
            'Processant Grups...',
            doc)
    );
    opObservables = opObservables.concat(
        parseChildren(
            'cursos_grupo',
            processCourseGroup,
            'groups',
            'Processant Curs Grup...',
            doc)
    );
    opObservables = opObservables.concat(
        parseChildren(
            'alumnos',
            processStudent,
            'students',
            'Processant Alumnes...',
            doc)
    );
    opObservables = opObservables.concat(
        parseChildren(
            'alumnos',
            processStudentEnrolment,
            'students',
            'Processant Matrícules Alumnes...',
            doc)
    );
    opObservables = opObservables.concat(
        parseChildren(
            'medidas_neses',
            processNese,
            'students',
            'Processant NE...',
            doc)
    );
    opObservables = opObservables.concat(
        parseChildren(
            'compensatorias',
            processComp,
            'students',
            'Processant Compensatòries...',
            doc)
    );
    opObservables = opObservables.concat(
        parseChildren(
            'contenidos_alumno',
            processSubjectStudent,
            'students',
            'Processant Assignatures Alumnes...',
            doc)
    );
    opObservables = opObservables.concat(
        parseChildren(
            'evaluaciones',
            processAssessment,
            'assessments',
            'Processant Avaluacions',
            doc)
    );
    
    opObservables.subscribe(
	msg => res.sseSend(msg),
	err => res.sseError(err),
	()  => res.sseEnd('OK')
    );
}

// Insert school data...
function schoolData(doc) {
    return Rx.Observable.create(observer => {
	observer.next('Processant centre...');
	
	mongodb.db.collection('schools').updateOne(
            {_id: doc.attr.codigo },
            { $set: { name: doc.attr.denominacion } },
            { upsert: true })
	    .then(() => observer.complete())
	    .catch(err => observer.error(err));
    });
    /*
    return Rx.Observable.fromPromise(
	mongodb.db.collection('schools').updateOne(
	    {_id: doc.attr.codigo },
	    { $set: { name: doc.attr.denominacion } },
	    { upsert: true })
	).map(res => 'Processing stages...');
    */
}

// Children parsing...
function parseChildren(childName, process, collection, msg, doc) {
    return Rx.Observable.create(observer => {
	observer.next(msg);

	var item = doc.childNamed(childName);

	if (item != undefined) {
	    var operations = [];

	    for (var i=0; i<item.children.length; i++) {
		var child = item.children[i];

		var op = process(child, doc);
		if (op != null) {
		    operations.push(op);
		}
	    }

	    if (operations.length > 0) {
		mongodb.db.collection(collection).bulkWrite(operations, {ordered: false})
		    .then(() => observer.complete())
		    .catch(err => observer.error(err));
	    }
	    else {
		observer.error("No s'ha trobat " + item.name + " en el fitxer de dades.");
	    }
	}
	else {
	observer.error("L'entitat '" + childName + "' no s'ha trobat en el fitxer de dades.");
	}
    });
    /*
    var item = doc.childNamed(childName);

    if (item != undefined) {
	var operations = [];

	for (var i=0; i<item.children.length; i++) {
	    var child = item.children[i];

	    var op = process(child, doc);
	    if (op != null) {
		operations.push(op);
	    }
	}

	if (operations.length > 0) {
	    return Rx.Observable.fromPromise(
		mongodb.db.collection(collection).bulkWrite(operations, {ordered: false})
		).map(res => nextMsg);
	}

	return Rx.Observable.throw('No ' + item.name + ' found in data file');
    }
    
    return Rx.Observable.throw('"' + childName + '" entity not found in data file.');
    */
}

/*
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
                    parseChildren(child, processSubjectStudent, 'students', 'evaluaciones', doc, res);
                    break;
		case 'evaluaciones':
                    res.sseSend('Processing assessments...');
                    parseChildren(child, processAssessment, 'assessments', null, doc, res);
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
	mongodb.db.collection(collection).bulkWrite(operations, {ordered: false})
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
*/
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
    if (child.name == 'contenido' && !child.attr.nombre_val.includes(excluded_content)) {
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
	var birthDate = child.attr.fecha_nac != null ? new Date(child.attr.fecha_nac) : null;
        var op = {
            updateOne: {
                filter: { _id: child.attr.NIA },
                update: {
		    $set: {
                        last_name: child.attr.apellido1 + ' ' + child.attr.apellido2,
                        first_name: child.attr.nombre,
                        birth_date: birthDate,
                        gender: child.attr.sexo == 'H' ? 'M' : 'F'
                    }
                },
                upsert: true
            }
        };

        return op;
    }
    
    return null;
}

function processStudentEnrolment(child, doc) {
    if (child.name == 'alumno') {
        var group = doc.attr.codigo + child.attr.grupo + doc.attr.curso;
        var op = {
            updateOne: {
                filter: { _id: child.attr.NIA/*, 'enrolments.group_id': { $ne: group }*/ },
                update: {
                    $addToSet: {
                        enrolments: {
                            school_id: doc.attr.codigo,
                            year: doc.attr.curso,
                            stage_id: child.attr.ensenanza,
                            course_id: child.attr.curso,
                            group_id: group,
                            active: child.attr.estado_matricula == 'M',
                            repeats: child.attr.repite != '0'
                        }
                    }
                }
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

    if (measures != undefined) {
        var m = measures.childWithAttribute('codigo', m_id);

        if (m != undefined) {
    	    return m.attr.nombre_val;
        }
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

function processAssessment(child, doc) {
    if (child.name == 'evaluacion' && child.attr.curso != ' ') {
	var id = doc.attr.codigo + child.attr.curso + child.attr.codigo + doc.attr.curso;
        var op = {
            updateOne: {
                filter: { _id: id },
                update: { $set: {
                    school_id: doc.attr.codigo,
                    year: doc.attr.curso,
                    stage_id: child.attr.ensenanza,
		    course_id: child.attr.curso,
                    name: child.attr.abreviatura_val,
		    order: parseInt(child.attr.orden)
                } },
                upsert: true
            }
        };

        return op;
    }

    return null;
}

module.exports = parser;
