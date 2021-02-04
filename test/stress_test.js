const env         = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const should = chai.should();

var opts = {
    logDirectory: "test/logs",//ATTENTION: le dossier "logDirectory" doit être présent
    fileNamePattern: "stress_test-roll-<DATE>.log",
    dateFormat: "YYYY.MM.DD"
};
const logger = require("../logger")(opts, "info");

const server = require('http').Server(app);

// ********** commander **********//

const commander = require('commander');
const program = new commander.Command();

program.requiredOption('-m, --messages <nb>', '20');
program.requiredOption('-s, --sockets <nb>', '5');
program.requiredOption('-c, --count <nb>', '600');

program.parse(process.argv);
const options = program.opts();
// ********** commander **********//

//calcul du temps max du test (en étant large):
//  max 5ms pour traiter 1 instance -> nbInstance * 5ms
const nbInstance = options.messages * options.sockets * options.count;
const maxTime = nbInstance * 5;

const sendMessage = (aSocket) => {
    var countObj = {
        count : aSocket.count,
        messageId : aSocket.mid++
    }
    aSocket.emit('enqueue',countObj);
}

describe("stress test avec plusieurs socket en parallèle", function() {
    
    it('Nombre message = '+options.messages+" nombre de socket = "+options.sockets+" count = "+options.count, function(done) {
        console.log("test_stress temps maximum= "+maxTime+"ms");

        var start = new Date();

        var sockOptions = {
            'force new connection': true
          };

        var clients = [];
        var nbSocket = options.sockets;

        for (let s = 0; s < options.sockets; s++) {
            var socket = require('socket.io-client').connect(config.baseurl, sockOptions);
            socket.on('connection', () => console.log('Client connected'));

            socket.nbMessage = options.messages;
            socket.count = options.count;
            socket.mid = 0;

            socket.on('error', function(err){
                console.log("stress_test ERROR = ", err);
                
                logger.error("Test stress -messages "+options.messages+" --sockets "+options.sockets+" --count "+options.count+": "+err);

                for (let i = 0; i < clients.length; i++) {
                    clients[i].destroy();
                }

                if(server) {
                    server.on('close', () => { done(err); });
                    server.close(() => {
                         server.unref(); 
                        });
                }
            });
            
            socket.on('processed', function(msg){

                this.count--;
                if (this.count == 0) {
                    this.nbMessage--;
                    
                    if (this.nbMessage == 0) {
                        //fin d'un socket
                        nbSocket--;
                        if (nbSocket == 0) {
                            //fin de TOUS les sockets

                            end = new Date();

                            var diff = end - start;
                            diff = new Date(diff);
                            var msec = diff.getMilliseconds();
                            var sec = diff.getSeconds();
                            var min = diff.getMinutes();
                            var hr = diff.getHours()-1;
                            if (min < 10){
                                min = "0" + min;
                            }
                            if (sec < 10){
                                sec = "0" + sec;
                            }
                            if(msec < 10){
                                msec = "00" +msec;
                            }
                            else if(msec < 100){
                                msec = "0" +msec;
                            }
                            var timeStr = min + ":" + sec + ":" + msec;

                            logger.info("Test stress -messages "+options.messages+" --sockets "+options.sockets+" --count "+options.count+" en "+timeStr);
                            if(server) {
                                server.on('close', () => { done(); });
                                server.close(() => { server.unref(); });
                            }
                        }
                    }else{
                        this.count = options.count;
                        sendMessage(this);
                    }
                }
            });

            clients.push(socket);
        }
        
        // launch TEST (it)
        for (let i = 0; i < clients.length; i++) {
            var aSocket = clients[i];

            sendMessage(aSocket);
        }

	}).timeout(maxTime);
});