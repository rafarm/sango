var mongodb = require('../mongo_connection');
var xmldoc = require('xmldoc');

function parser(req, res) {
    console.log('Ingest - parse init: '+ req.file.originalname);
    if (req.file.mimetype != 'text/xml') {
	res.status(500);
	res.json({msg:'Not an xml file.'});
	return;
    }
    
    var doc = new xmldoc.XmlDocument(req.file.buffer);
    if (doc.name != 'centro') {
	res.status(500);
        res.json({msg:'Invalid file format.'});
	return;
    }

    // Insert school data...
    mongodb.db.collection('schools').updateOne(
	{_id: doc.attr.codigo },
	{ $set: { name: doc.attr.denominacion } },
	{ upsert: true })
	.then(function(result) {
	    res.json(result);
	})
	.catch(function(error) {
	    res.status(500);
	    res.json(error);	    
	});
}

module.exports = parser;
