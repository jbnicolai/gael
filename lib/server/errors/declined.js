function DeclinedError(message, status) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name = "DeclinedError";
  this.message = message || "Declined";
  this.status = status || 423;
}

DeclinedError.prototype.__proto__ = Error.prototype;

module.exports = DeclinedError;