function UnauthenticatedError(message, status) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name = "UnauthenticatedError";
  this.message = message || "Unauthenticated";
  this.status = status || 401;
}

UnauthenticatedError.prototype.__proto__ = Error.prototype;

module.exports = UnauthenticatedError;