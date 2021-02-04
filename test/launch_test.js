const env         = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const should = chai.should();

var opts = {
    logDirectory: "test/logs",//ATTENTION: le dossier "logDirectory" doit être présent
    fileNamePattern: "launch_test-roll-<DATE>.log",
    dateFormat: "YYYY.MM.DD"
};
const logger = require("../logger")(opts, "info");

const server = require('http').Server(app);

// ********** commander **********//
const commander = require('commander');
const program = new commander.Command();

program.requiredOption('-i, --instances <nb>', '600');

program.parse(process.argv);
const options = program.opts();
// ********** commander **********//

//calcul du temps max du test (en étant large):
//  max 500ms pour traiter 1 instance -> nbInstance * 500ms
const maxTime = options.instances * 500;

describe("Test avec le nombre d'instance", function() {
    
    it('Nombre intances = '+options.instances, function(done) {
        console.log("test_launch temps maximum= "+maxTime+"ms");

		const socket = require('socket.io-client')(config.baseurl);
        socket.on('connection', () => console.log('Client connected'));

        var start = new Date();

        var nbElem = options.instances;
        var countObj = {
            count : options.instances,
            messageId : 1
        }
        socket.emit('enqueue',countObj);

        socket.on('error', function(err){
            console.log("launch_test ERROR");
            logger.error("Test instances ["+options.instances+"]: "+err);

            if(server) {
                server.on('close', () => { done(err); });
                server.close(() => { server.unref(); });
            }
        });

        socket.on('processed', function(msg){
            nbElem--;
            if (nbElem == 0) {

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

                logger.info("Test instances ["+options.instances+"] en "+timeStr);
                if(server) {
                    server.on('close', () => { done(); });
                    server.close(() => { server.unref(); });
                }
            }
         });
	}).timeout(maxTime);//timeout de 60s pour laisser le temps de faire un grand nombre de message

});