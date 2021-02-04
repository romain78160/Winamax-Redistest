// Imports
const express = require('express');
const path = require('path');
const bodyParser  = require('body-parser');
const ent = require('ent'); // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)

const env         = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/config/config.json')[env];

const router   = require('./router').router;

const app = express();

// ajout de socket.io
const server = require('http').Server(app)
const io = require('socket.io')(server)

const workers = require('./worker');

// REDIS //
const redis = require('redis');
const { Console } = require('console');

const keyPariList = "pariList";
const redisHost = config.redisServer.host;
const redisPort = config.redisServer.port;

    const redisCli = redis.createClient(redisPort, redisHost); //creation du client (par defaut 127.0.0.1:6379)


    //ecoute du client redis
    redisCli.on('connect', function() {
        console.log('connected to REDIS');
    });

app.use(express.static(__dirname + '/public'));

app.set('views', [
                        path.join(__dirname, 'views'),
                    ]
        );
app.set('view engine', 'ejs');

// Body Parser configuration
app.use(bodyParser.urlencoded({ extended: true }));//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.json());// support parsing of application/json type post data

app.post('/processed', function (req, res, next) {
    var socketResult = {
        command: "processed",
        result:{
            idx: req.body.idx
        },
        mid: req.body.mid
    };

    io.to(req.body.cid).emit('processed',socketResult);
    
    res.status(200).json({});
});

// Router
app.use(router);

io.on('connection', (socket) =>{

    //ecoute de enqueue
    socket.on('enqueue', function (message) {
        
        this.nbElem = parseInt(message.count);//nombre d'element à inserer
        this.workerList = [];

        // creation du tableau a inserer
        for (let i = 0; i < this.nbElem; i++) {
            var aElem = {
                cid: socket.id,
                mid: parseInt(message.messageId),
                idx: (i+1)
            };            

            var elemStr = JSON.stringify(aElem);
            this.workerList.push(elemStr);
        }

        //envoie du tableau en 1 seule commande
        redisCli.rpush(keyPariList, this.workerList, (err, reply) => {
            if(err){
                console.error("Redis - rpush ERREUR = ",err)
            }else{

                var workersJob = new workers(io, this.workerList, redisCli, keyPariList);
                workersJob.start().then(function(){
                    
                }).catch(function(err) {
                    console.log("Workers error ", err);
                });

            }
        });

    });

 });


// Launch server
server.listen(config.serverport, function() {
    console.log('Serveur en écoute sur : http://localhost:'+ config.serverport);
});

module.exports = app; //pour les test