var _ = require('underscore')
  , Promise = require('bluebird')
  , bcrypt = require('bcrypt')
  , utils = require('../utils');

var Authenticator = function() {
  if (this instanceof Authenticator === false) return new Authenticator;
};

Authenticator.prototype.encrypt = function(password) {
  return new Promise(function(resolve, reject) {

    // Generate salt
    var salt = bcrypt.genSaltSync(9);

    // Hash password
    var hash = bcrypt.hashSync(password, salt);

    return resolve({ hash: hash, salt: salt });
  });
};

Authenticator.prototype.authenticate = function(compareTo, password) {
  return new Promise(function(resolve, reject) {

    bcrypt.compare(password || '', compareTo, function(err, matches) {
      if (err || matches === false) return reject(new Error('auth.credentials'));

      resolve(matches);
    });
  });
};

Authenticator.prototype.generateToken = function() {
  return new Promise(function(resolve, reject) {

    var token = utils.token(10)
      , salt = bcrypt.genSaltSync(6);

    bcrypt.hash(token, salt, function(err, hash) {
      if (err) return reject(err);

      resolve({ token: token, hashedToken: hash });
    });
  });
};

Authenticator.prototype.generateAuthCode = function() {
  return new Promise(function(resolve, reject) {

    var code = (utils.random(899999) + 100000).toString()
      , salt = bcrypt.genSaltSync(6);

    bcrypt.hash(code, salt, function(err, hash) {
      if (err) return reject(err);

      resolve({ authCode: code, hashedAuthCode: hash });
    });
  });
};

Authenticator.prototype.validate = function(compareTo, token, property) {
  return new Promise(function(resolve, reject) {

    bcrypt.compare(token || '', compareTo, function(err, matches) {
      if (err || matches === false) return reject(new Error('auth.' + (property || 'token')));

      resolve(true);
    });
  });
};

module.exports = new Authenticator;