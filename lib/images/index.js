var _ = require("underscore")
  , Promise = require("bluebird")
  , log = require("../log")
  , configuration = require("../configuration");

var Images = function(provider) {
  if (this instanceof Images === false) return new Images(provider);

  if (provider == null) provider = configuration("provider:images");

  this.store = require("./" + provider);
};

Images.prototype.upload = function(file, name, type) {
  return this.store.upload(file, name, type);
};

Images.prototype.download = function(url) {
  return this.store.download(url);
};

Images.prototype.remove = function(url) {
  return this.store.remove(url);
};

module.exports = Images;