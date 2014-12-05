var monk = require("monk")
  , chalk = require("chalk")
  , configuration = require("../configuration")
  , log = require("../log");

var Store = function() {
  if (this instanceof Store === false) return new Store();

  var connectionUrl = this.connectionUrl();

  this.database = monk(connectionUrl);

  log.info("Connected to MongoDB at " + chalk.green(connectionUrl));
};

Store.prototype.connectionUrl = function() {
  if (configuration("mongodb:url")) return configuration("mongodb:url");

  var url = "mongodb://";

  if (configuration("mongodb:username") && configuration("mongodb:password")) {
    url += (configuration("mongodb:username") + "@" + configuration("mongodb:password"));
  }

  url += (configuration("mongodb:host") + ":" 
        + configuration("mongodb:port") + "/" 
        + configuration("mongodb:database"));

  return url;
};

Store.prototype.close = function(done) {
  this.database.close(done);
};

module.exports = new Store;
