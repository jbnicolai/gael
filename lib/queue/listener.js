var redis = require("redis")
  , socketIo = require("socket.io")
  , chalk = require("chalk")
  , util = require("util")
  , debug = require("debug")("sockets")
  , log = require("../log")
  , configuration = require("../redis/connection");

var noOp = function() {};

var Listener = function(server) {
  if (this instanceof Listener === false) return new Listener(channels, server);

  var config = configuration();
  
  this.io = socketIo(server);
  this.users = {};

  this.connection = redis.createClient(config.port, config.host);
  if (config.password) this.connection.auth(config.password, noOp);

  log.info("Connected to redis for broadcast channels at " + chalk.green(config.host) + " on port " + chalk.green(config.port));
};

var subscribe = function(channels, socket) {
  channels.forEach(function(name) {
    debug("Setting up listener for " + chalk.green(name) + " for " + chalk.green(socket.user));

    this.connection.subscribe("channel:" + name);

    this.connection.on("message", function(channel, message) {
      if (channel.split(":")[1] !== name) return;

      message = JSON.parse(message);

      var data = message.data
        , user = message.user;

      if (user === socket.user) {
        debug("Received message on channel " + chalk.green(name) + " for " + chalk.green(socket.user));
        
        socket.emit(name, data);
      }
    });
  }.bind(this));
};

Listener.prototype.listen = function() {
  var users = this.users
    , channels = Array.prototype.slice.call(arguments);

  this.io.on("connection", function(socket) {
    socket.setMaxListeners(0);

    socket.on("signOn", function(user) { // TODO Secure this
      debug("User " + user + " signed on");

      this.users[user] = user;
      socket.user = user;

      subscribe.call(this, channels, socket);

    }.bind(this));

    socket.on("signOut", function(user) {
      debug("User " + user + " signed out");

      this.users[user] = null;
      socket.user = null;

    }.bind(this));

    socket.on("disconnect", function() {
      if (socket.user == null) return;

      debug("User " + socket.user + " disconnected");

      this.users[socket.user] = null;
      socket.user = null;
      socket = null;

    }.bind(this));

  }.bind(this));
};

module.exports = Listener;
