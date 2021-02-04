// Imports
var express         = require('express');

const WinCtrl = require('./controllers/WinCtrl');

// Router
exports.router = (function() {
  var router = express.Router();

  // homepage
  router.route('/').get(WinCtrl.homePage);

  return router;
})();
