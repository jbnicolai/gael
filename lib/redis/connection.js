var configuration = require("../configuration");

module.exports = function() {
  if (configuration("redis:url")) {
    var url = require("url").parse(configuration("redis:url"));

    var config = {
      port: url.port
    , host: url.hostname
    };

    if (url.auth) config.password = url.auth.split(":")[1];

    return config;

  } else {
    return {
      port: configuration("redis:port")
    , host: configuration("redis:host")
    , password: configuration("redis:password")
    };
  }
};