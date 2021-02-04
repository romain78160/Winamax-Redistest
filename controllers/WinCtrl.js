// Imports

var env       = process.env.NODE_ENV || 'development';
var config    = require('../config/config.json')[env];

// Routes
module.exports = {

  homePage : function(req, res, next){
    res.render("index", { title: 'Winamax | Test', messageFlash: '', baseurl: config.baseurl });
  },

}