
const express = require('express');
const bodyParser = require('body-parser');
const comedoriaController = require('./controllers/comedoria');
const homeController = require('./controllers/home');
const resultadoController = require('./controllers/resultado');
const app = express();
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const uuid = require('uuid');
const ObjectId = require('mongodb').ObjectID;
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:true}));

app.use(function(req, res, next){
  if(req.query._method == 'DELETE'){
    req.method = 'DELETE';
    req.url = req.path;
  }
  next();
});

app.get('/', homeController.index);

app.get('/eventos/:id/:status*?', function (req, res) {
 	const url = 'mongodb://localhost:27017/oxifood';

 // Use connect method to connect to the server
 	MongoClient.connect(url, function(err, db) {


 	var collection = db.collection('participar');


 		collection.find({eventid:req.params.id}).toArray(function(err, docs) {
console.log(req.params.status);
 							res.render('participar', {participar:docs, eventid:req.params.id, status: req.params.status});
 				   });

 					 db.close();
 	});
  });


 app.get('/evento/:id/resultado', resultadoController.index);

  app.delete('/event/:id', function(req,res) {
  const url = 'mongodb://localhost:27017/oxifood';
    MongoClient.connect(url, function(err, db) {

  			const collection = db.collection('eventos');
      collection.remove({"_id": req.params.id});
        res.redirect('/');

        db.close();
    });
  });

  app.delete('/participar/:id', function(req,res) {
  const url = 'mongodb://localhost:27017/oxifood';
    MongoClient.connect(url, function(err, db) {

  			const collection = db.collection('participar');
      collection.remove({"_id": req.params.id});
        res.redirect('/');

        db.close();
    });
  });

 app.get('/evento', function(req, res) {
 const url = 'mongodb://localhost:27017/oxifood';

  // Use connect method to connect to the server
  	MongoClient.connect(url, function(err, db) {

  	   const collection = db.collection('comedorias');
       collection.find({}).toArray(function(err, docs){

         res.render('criarevento', {comedorias: docs});
       })

  		 db.close();
  	});
 });

 app.post('/eventos', function (req, res) {
 	const url = 'mongodb://localhost:27017/oxifood';

 // Use connect method to connect to the server
 MongoClient.connect(url, function(err, db) {
   const collection = db.collection('eventos');

 		const event = {
 			_id: uuid.v4(),
      restaurant: req.body.restaurant,
      name: req.body.name,
 			ownername: req.body.ownername,
 			time: new Date(req.body.time),
      timeFinished: new Date(req.body.timeFinished)
 		};

 					collection.insertOne(event);
 					res.redirect('/');

 				db.close();

 	});
 });

 app.post('/participar', function (req, res) {
 	const url = 'mongodb://localhost:27017/oxifood';

 		// Use connect method to connect to the server
 		MongoClient.connect(url, function(err, db) {

 			const collection = db.collection('participar');

 				const dados = {
	 		    _id: uuid.v4(),
	 				eventid: req.body.eventid,
	 				firstname: req.body.firstname,
	 				restriction: req.body.restriction,
          flavor: req.body.flavor
        };

        collection.insertOne(dados);
				res.redirect('/');

 			  db.close();
 		});
 });

 app.get('/restaurante', function(req, res) {
  res.render('addrestaurante');
 });

app.post('/comedorias', comedoriaController.create);

app.listen(3000, function () {
 	console.log('Example app listening on port 3000!');
 });
