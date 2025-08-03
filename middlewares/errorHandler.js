const errorHandler = (err, req, res, next) => {
  console.error('ERROR', err);

  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';
  const message = err.isOperational ? err.message : 'Something went wrong!';

  res.status(statusCode).json({
    status,
    message
  });
};

module.exports = errorHandler;