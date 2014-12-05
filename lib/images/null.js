var _ = require("underscore")
  , Promise = require("bluebird");

var Store = function() {
  if (this instanceof Store === false) return new Store;
};

Store.prototype.upload = function(file, name, type) {
  return Promise.cast();
};

Store.prototype.download = function(url) {
  return Promise.cast();
};

Store.prototype.remove = function(url) {
  return Promise.cast();
};

module.exports = new Store;