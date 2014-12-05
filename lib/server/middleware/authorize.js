var _ = require('underscore')
  , ministry = require('../../')
  , log = ministry.log
  , NotAuthorizedError = require('../errors/notauthorized')
  , Authorizer = ministry.Authorizer
  , rights = Authorizer.rights;

module.exports = function(permission) {
  return function(req, res, next) {
    var user = req.user;

    if (user == null) return next(new NotAuthorizedError());

    var right = function(permission) {
      if (permission.length > 1) return rights[permission[1]];
      
      return ({
        POST   : rights.Create
      , GET    : rights.Read
      , PUT    : rights.Update
      , PATCH  : rights.Update
      , DELETE : rights.Delete
      })[req.method];
    };

    var thing = permission[0]
      , authorized = new Authorizer(Authorizer.fromRoles(user.roles)).can(thing, right(permission));

    if (authorized === false) return next(new NotAuthorizedError());

    next();
  }
};
