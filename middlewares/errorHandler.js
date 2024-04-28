const errorHandler = (error, req, res, next) => {
  let status = 500;
  let message = "Internal Server Error";
  console.log(error);

  if (
    error.name === "SequelizeValidationError" ||
    error.name === "ValidationErrorItem" ||
    error.name === "SequelizeUniqueConstraintError"
  ) {
    status = 400;
    message = error.errors.map((err) => err.message)[0];
  }

  if (error.name === "ForeignKeyConstraintError") {
    status = 400;
    message = "Data does not meet Foreign Key Requirements";
  }
  if (error.name === "SequelizeDatabaseError") {
    status = 400;
    message = "Invalid Data Type";
  }

  if (error.name === "ReqUser") {
    status = 400;
    message = "Username is required!";
  }
  if (error.name === "ReqPass") {
    status = 400;
    message = "Password is required!";
  }
  if (error.name === "InBalance") {
    status = 400;
    message = "Not Enough Balance!";
  }

  if (error.name === "InvalidAmount") {
    status = 400;
    message = "Invalid Amount, please input a positive number!";
  }

  if (error.name === "NoInvest") {
    status = 404;
    message = "You don't have an investment with that id!";
  }

  if (error.name === "InvalidFund") {
    status = 404;
    message = "There are no Mutual Funds with that ID!";
  }

  if (error.name === "InvalidLogin") {
    status = 401;
    message = "Invalid Username or Password";
  }

  if (error.name === "InvalidTransaction") {
    status = 400;
    message = "Transaction is Invalid! Please check the inputs are correct!";
  }

  if (error.name === "InvalidSwitch") {
    status = 400;
    message = "You can't switch to a different manager's fund!";
  }

  if (error.name === "Unauthorized") {
    status = 401;
    message = "Authentication Error, please login first!";
  }

  if (error.name === "JsonWebTokenError") {
    status = 401;
    message = "Authentication Error, invalid token";
  }

  if (error.name === "Forbidden") {
    status = 403;
    message = "You don't have access";
  }

  if (error.name === "UserNotFound") {
    status = 404;
    message = `Username not found`;
  }

  res.status(status).json({ message });
};

module.exports = errorHandler;
