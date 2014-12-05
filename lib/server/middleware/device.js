var device = require('express-device')
  , configuration = require('../../configuration');

module.exports.capture = function(options) {
  return function(req, res, next) {
    var ua = (req.headers['user-agent'] || '').toLowerCase()
      , mode = configuration('mode');

    // log.info('UA', ua);
                          // Google                               // FB
    if (mode === 'bot' || req.query._escaped_fragment_ != null || ua.match(/facebookexternalhit/i)) {
      req.device = { type: 'bot' };
      if (next) return next();
    } else {
      return device.capture(options)(req, res, next);
    }
  };
};

module.exports.enableViewRouting = function(app, options) {
  device.enableViewRouting(app, options);
};