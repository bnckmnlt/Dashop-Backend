const createError = (status, message, req, res) => {
  const err = new Error();
  err.status = status;
  err.message = message;

  return err;
};

module.exports = createError;
