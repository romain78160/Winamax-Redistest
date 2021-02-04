const env         = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/config/config.json')[env];

const axios = require('axios');
const async = require("async");

module.exports = class Workers {
    constructor(_io, _workerList, _redisCli, _keyPariList) {
        this.io = _io;
        this.workerList = _workerList;
        this.redisCli = _redisCli;
        this.keyPariList = _keyPariList;
    }
    
    start() {
        return new Promise((resolve, reject) => {
            
            var maxWorker = this.workerList.length;
            var limitAccess = 250;

            if (this.io.eio.clientsCount > 1 ) {
                limitAccess = Math.round(250/this.io.eio.clientsCount);
            }

            //nombre d'exécution en parallèle limité pour ne pas forcer l'acces à l'api (sinon connection refused)
            async.eachLimit(this.workerList, limitAccess, (elem, callback) => {
                    //temps de traitement aleatoire entre 300ms et 500ms
                    var max = 500;
                    var min = 300;
                    var randomTime = Math.floor(Math.random() * (max - min + 1)) + min;
                    
                    var sendhttp = (_elem) => {
                        this.redisCli.lrem(this.keyPariList,0, _elem, (err, result) => {
                            if (err) {
                                console.log("redisCli.lrem ERROR = ",err);
                                reject(err);
                            } else {
                                if (result > 0) {
                                    var _elemObj = JSON.parse(elem);
                                    var elemToPost = {
                                        command: 'processed',
                                        idx: _elemObj.idx,
                                        cid: _elemObj.cid,
                                        mid: _elemObj.mid
                                    };

                                    axios.post(config.baseurl+"processed",elemToPost)
                                    .then((response) => {
                                        maxWorker--;
                                        if(maxWorker == 0){
                                            resolve();//fin du worker
                                        }
                                        callback();
                                    })
                                    .catch( (error) => {
                                        console.error("POST ERROR = ",error);
                                        this.io.to(elemToPost.cid).emit('error', error);
                                        reject(error);
                                    });
                                }else
                                {
                                    console.log("sendhttp = element non trouvé =>",elem);
                                    //element non trouvé mais n'empeche pas les autres de continuer
                                }
                            }
                        });

                    };
                    setTimeout(function () {
                        sendhttp(elem);
                    }, randomTime);

                }, function(err) {
                    if(err) 
                    {
                        console.log("err : ",err);
                        throw err;
                    }
                });
        });
    }
 }
