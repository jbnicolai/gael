var Promise = require("bluebird")

var Cache = function() {
  if (this instanceof Cache === false) return new Cache;
};

Cache.prototype.set = function(key, data, ttl, tags) {
  return Promise.cast();
};

Cache.prototype.get = function(key) {
  return Promise.cast();
};

Cache.prototype.fetch = function(key, fetch, context, args, tag) {
  return fetch.apply(context, args);
};

Cache.prototype.invalidate = function(tags) {
  return Promise.cast();
};

Cache.prototype.clear = function() {
  return Promise.cast();
};

module.exports = new Cache;