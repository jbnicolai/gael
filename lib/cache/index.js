var _ = require("underscore")
  , stow = require("stow")
  , redis = require("redis")
  , Promise = require("bluebird")
  , configuration = require("../redis/connection");

var noOp = function() {};

var Cache = function() {
  if (this instanceof Cache === false) return new Cache;

  var config = configuration()
    , client = redis.createClient(config.port, config.host);
  
  if (config.password) client.auth(config.password, noOp);

  this.ttl = configuration("cache:ttl");

  this.cache = stow.createCache(stow.backends.Redis, {
    client: client
  , prefix: "cache:"
  , ttl: this.ttl
  });
};

var promisify = function(method) {
  return Promise.promisify(this.cache[method].bind(this.cache));
};

Cache.prototype.set = function(key, data, ttl, tags) {
  return promisify.call(this, "set")(key, data, ttl, tags);
};

Cache.prototype.get = function(key) {
  return promisify.call(this, "get")(key);
};

Cache.prototype.fetch = function(key, fetch, context, args, tag) {
  var that = this;

  return this.get(key).then(function(results) {
    if (results && results.data) return JSON.parse(results.data);

    return fetch.apply(context, args).then(function(data) {
      return that.set(key, JSON.stringify(data), that.ttl, tag(data)).then(function() {
        return data;
      });
    });
  });
};

Cache.prototype.invalidate = function(tags) {
  return promisify.call(this, "invalidate")(tags);
};

Cache.prototype.clear = function() {
  var that = this
    , keys = Array.prototype.slice.call(arguments);

  return Promise.all(keys.map(function(key) {
    return promisify.call(that, "clear")(key);
  }));
};

module.exports = new Cache;