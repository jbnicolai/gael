var Promise = require("bluebird")
  , twilio = require("twilio")
  , log = require("../log")
  , configuration = require("../configuration");

module.exports = function(user, text) {
  var client = twilio(configuration("twilio:id"), configuration("twilio:token"));

  return new Promise(function(resolve, reject) {

    client.sendMessage({
      to: user.mobile
    , from: configuration("twilio:number")
    , body: text
    }
    , function(err, response) {
      if (err) return reject(new Error("twilio.fail"));
      return resolve(response);
    });

  });
};