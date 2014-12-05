var _ = require('underscore')
  , ministry = require('ministry')
  , UnauthenticatedError = ministry.errors.UnauthenticatedError
  , utils = ministry.utils;

var authenticate = function(req) {
  var auth = req.headers.authorization;
  if (!auth) return;

  var parts = auth.split(/\s+/);

  if (parts[0].toLowerCase() !== 'basic') return;
  if (parts.length !== 2) return;

  var credentials = new Buffer(parts[1], 'base64').toString().split(':');
  if (credentials.length !== 2) return;

  return { username: credentials[0], password: credentials[1] };
};

module.exports = function(session, options) {
  options = _.defaults(options, { restrict: false });

  return function(req, res, next) {
    var auth = authenticate(req);
  
    if (auth == null && options.restrict) throw new UnauthenticatedError();
    if (auth == null) return next();

    session.authenticate(auth.username, auth.password)

    .then(function(user) {
      if (user == null && options.restrict) throw new UnauthenticatedError();

      req.user = user;

      next();
    })

    .catch(function(err) {
      if (!options.restrict) err == null; // Ignore error

      next(err);
   });
  }
};

