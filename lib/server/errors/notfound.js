function NotFoundError(message, status) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name = "NotFoundError";
  this.message = message || "Not Found";
  this.status = status || 404;
}

NotFoundError.prototype.__proto__ = Error.prototype;

module.exports = NotFoundError;