function DuplicateError(message, status) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name = "DuplicateError";
  this.message = message || "Duplicate";
  this.status = status || 422;
}

DuplicateError.prototype.__proto__ = Error.prototype;

module.exports = DuplicateError;