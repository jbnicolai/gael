var _ = require("underscore")
  , fs = require("fs")
  , path = require("path")
  , crypto = require("crypto")
  , slug = require("slug");

var token = function(len) {
  var set = "0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ"
    , length = set.length
    , uniq = "";

  for (var i = 0; i < len; i++) {
    uniq += set[random(length)];
  }
  
  return uniq;
};

var random = function(length) {
  return Math.floor(Math.random() * length);
};

var key = function(items) {
  return _(items).isArray()
    ? items.sort().join(":")
    : items;
};

var encrypt = function(text) {
  var cipher = crypto.createCipher("aes-256-cbc", "d6F3Efeq")
    , enc = cipher.update(text, "utf8", "hex");

  enc += cipher.final("hex");

  return enc;
};

var decrypt = function(text) {
  var decipher = crypto.createDecipher("aes-256-cbc", "d6F3Efeq")
    , dec = decipher.update(text, "hex", "utf8");

  dec += decipher.final("utf8");

  return dec;
};

var slugify = function(text) {
  return slug(text.toLowerCase());
};

var folders = function(directory) {
  return _.chain(fs.readdirSync(directory))

  .map(function(file) {
    if (file[0] !== ".") {
      var stat = fs.statSync(path.join(directory, file));
      if (stat.isDirectory()) return file;
    }
  })

  .compact()
  .value();
};

var percentage = function(numerator, denominator) {
  return Math.round((numerator / denominator) * 100)
};

var getApp = function(argv) {
  var DEFAULT_APP = "app";

  var app = _(argv).find(function(arg) {
    return arg.indexOf("--app:") === 0;
  });
  return (app == null) ? DEFAULT_APP : app.split(":")[1];
};

var buildQuery = function(parameters) {
  return _.chain(parameters)
  .pairs()
  .map(function(parameter) {
    return parameter.join("=");
  })
  .value()
  .join("&");
};

var generateHandle = function(handle, Repository, index) {
  if (index == null) index = 0;

  var test = handle + (index === 0 ? "" : index);
  
  return Repository.find({ handle: test }).then(function(entity) {
    if (entity == null) return test;
    return generateHandle(handle, Repository, ++index);
  });
};

module.exports = {
  token: token
, random: random
, encrypt: encrypt
, decrypt: decrypt
, percentage: percentage
, slugify: slugify
, folders: folders
, getApp: getApp
, key: key
, buildQuery: buildQuery
, generateHandle: generateHandle
};