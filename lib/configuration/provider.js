var configuration = require("./");

module.exports = function(subsystem) {
  var provider = configuration("provider:" + subsystem);

  return (provider == null)
    ? {}
    : require("../" + subsystem.replace(":", "/") + "/" + provider);
};