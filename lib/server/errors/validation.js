function ValidationError(message, status) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name = "ValidationError";
  this.message = message || "Validation Error";
  this.status = status || 422;
}

ValidationError.prototype.__proto__ = Error.prototype;

module.exports = ValidationError;