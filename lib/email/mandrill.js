var _ = require("underscore")
  , Promise = require("bluebird")
  , mandrill = require("mandrill-api/mandrill")
  , configuration = require("../configuration");

module.exports = function(message) {
  var client = new mandrill.Mandrill(configuration("mandrill:id"));
  message.subaccount = configuration("mandrill:subaccount")

  return new Promise(function(resolve, reject) {
    client.messages.send({ message: message }, function(result) {
      if (result.reject_reason == null) return resolve(result);
      return reject(new Error(result.reject_reason));
    }, reject);
  });
};