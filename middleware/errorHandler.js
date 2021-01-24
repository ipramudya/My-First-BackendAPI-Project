const ErrorResponse = require('../utilities/errorResponse');

const errorHandler = (err, req, res, next) => {
  let subError = { ...err };
  subError.message = err.message;

  // Log to Console
  console.log(err);

  //Mongoose Error Request ID
  if (err.name === 'CastError') {
    const message = `Resource with ID: ${err.value} Not Found !`;

    //Membuat isi error object menjadi isi properti dari ErrorResponse
    subError = new ErrorResponse(message, 404);
  }

  //Mongoose Duplicated Value
  if (err.code === 11000) {
    const message = `Duplicate Value in the Field !`;

    //Membuat isi error object menjadi isi properti dari ErrorResponse
    subError = new ErrorResponse(message, 400);
  }

  //Mongoose Empty Request Object
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((value) => value.message);
    console.log(typeof message);

    subError = new ErrorResponse(message, 400);
  }

  //Status to the Client
  res.status(subError.statusCode || 500).json({
    success: false,
    error: subError.message || 'Server Error',
  });
};

module.exports = errorHandler;
