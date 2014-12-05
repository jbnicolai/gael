var _ = require("underscore")
  , Promise = require("bluebird")
  , log = require("../log")
  , template = require("../utils/template")
  , configuration = require("../configuration");

var Texter = function(templates, provider) {
  if (this instanceof Texter === false) return new Texter(provider);

  if (provider == null) provider = configuration("provider:sms");

  this.sender = require("./" + provider);
  this.compile = template(templates);
};

Texter.prototype.send = function(user, name, data, force) {
  if ((!user.allowSms && !force) || !user.mobile) return Promise.cast();

  _(data).extend({
    host: configuration("host")
  , user: user
  });

  return this.compile(name, data)

  .then(function(text) {
    return this.sender(user, text);    
  }.bind(this));
};

module.exports = Texter;