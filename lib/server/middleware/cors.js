var cors = require('cors')
  , configuration = require('../../configuration');

module.exports = function() {
  var config = configuration('http:cors') || []
    , options = {
    origin: function(origin, next) {
      next(null, config.indexOf(origin) >= 0);      
    }
  };

  return cors(options);
};