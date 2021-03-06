const MongoClient = require('mongodb').MongoClient;
const comedoriaRepository = require('./comedoria');

const EventoRepository = {
  url: process.env.MONGODB_URI || 'mongodb://localhost:27017/oxifood',
  findOne: (id, callback) => {
    MongoClient.connect(EventoRepository.url, (err, db) => {
      db.collection('eventos').find({_id: id}).toArray((err, eventos) => {
        callback(eventos[0]);
        db.close();
      });
    });
  },
  allFormated: (callback) => {
   	MongoClient.connect(EventoRepository.url, (err, db) => {
     	db.collection('eventos').find({}).toArray((err, eventos) => {
        const restaurantIds = eventos.map(evento => evento.restaurant);

        comedoriaRepository.findMany(restaurantIds, comedorias => {
          eventos.forEach(evento => {
            comedorias.forEach(comedoria => {
              if (evento.restaurant === comedoria._id) {
                evento.restaurant = comedoria.nameplace;
                evento.imgRestaurant = comedoria.img;
              }
            });
          });
          callback(eventos);
        });
        db.close();
     	});
   	});
  }
};

module.exports = EventoRepository;
