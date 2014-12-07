var _ = require('underscore')
  , Promise = require('bluebird')
  , log = require('../log')
  , utils = require('../utils')
  , template = require('../utils/template')
  , configuration = require('../configuration');

var Emailer = function(templatePaths, provider) {
  if (this instanceof Emailer === false) return new Emailer(templatePaths, provider);

  if (provider == null) provider = configuration('provider:email');

  this.sender = require('./' + provider);
  this.compile = template(templatePaths);
};

var buildMessage = function(user, subject, text, html) {
  return {
    subject: subject
  , text: text
  , html: html
  , from_email: configuration('email:from')
  , from_name: configuration('email:name')
  , to: [{ email: user.email, name: user.name }]
  , headers: { 'Reply-To': configuration('email:reply') }
  };
};

Emailer.prototype.send = function(user, subject, text, force) {
  if (!user.allowEmails && !force) return Promise.cast();

  return this.sender(buildMessage(user, subject, text));
};

Emailer.prototype.sendUsingTemplate = Promise.method(function(user, subject, name, data, force) {
  if ((!user.settings.allowEmails && !force) || !user.email) return;

  _(data).extend({
    host: configuration('host')
  , user: user
  });

  return this.compile(name, data)

  .then(function(html) {
    return this.sender(buildMessage(user, subject, null, html));    
  }.bind(this));
});

module.exports = Emailer;