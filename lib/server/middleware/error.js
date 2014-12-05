var log = require('../../log');

module.exports = function() {
  return function(err, req, res, next) {
    if (err.message == null) err.message = 'Error';
    if (err.status == null) err.status = 500;

    log.error(err.message, err.stack);

    var send = function() {
      return res.send(err.status, err.message);
    };

    res.format({
      json: function() {
        return res.status(err.status)
                  .json({ message: err.message, code: err.status, error: err.name });
      }
      
    , xml: function() {
        return send();
      }
      
    , text: function() {
        return send();
      }
      
    , html: function() {
        res.status(err.status)
           .render('common/error', { message: err.message, code: err.status, error: err.name });
      }
    });
  };
};
