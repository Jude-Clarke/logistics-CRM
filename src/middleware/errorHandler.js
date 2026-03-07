const { ValidationError, DBError } = require("objection");

const {
  UniqueViolationError,
  ForeignKeyViolationError,
  NotNullViolationError,
} = require("objection-db-errors");

// this is a helper function to convert snake_case to camelCase for api consistency
const toCamel = (str) => {
  return str.replace(/([-_][a-z])/gi, ($1) => {
    return $1.toUpperCase().replace("-", "").replace("_", "");
  });
};

const errorHandler = (err, req, res, next) => {
  // Objection Validation Errors (e.g. wrong data type)
  if (err instanceof ValidationError) {
    // 400 Bad Request
    return res.status(400).json({
      type: "ValidationError",
      message: err.message,
      data: err.data,
    });
  }

  // Unique Constraint Violation
  if (err instanceof UniqueViolationError) {
    const columns = err.columns || [];
    return res.status(409).json({
      type: "Conflict",
      message: "A record with this unique identifier already exists.",
      fields: columns.map(toCamel),
    });
  }

  // Foreign Key Violation (e.g. trying to create a shipment for a shipper that doesn't exist)
  if (err instanceof ForeignKeyViolationError) {
    return res.status(400).json({
      type: "ForeignKeyViolation",
      message: "The related record (Shipper or Carrier) was not found.",
    });
  }

  // Catch Missing Fields
  if (err instanceof NotNullViolationError) {
    const fieldName = err.column ? toCamel(err.column) : "unknown";
    return res.status(400).json({
      type: "BadRequest",
      message: `The field '${fieldName}' is required and cannot be empty.`,
    });
  }

  // Safety Net for all other Database Errors to avoid revealing my schema
  if (err instanceof DBError) {
    // log the real error to the terminal.
    console.error("DATABASE_ERROR:", err.nativeError || err);

    // send a vague error message to the client
    return res.status(500).json({
      type: "DatabaseError",
      message:
        "A database error occured. The administrators have been notified.",
    });
  }

  if (res.headersSent) {
    return next(err);
  }

  console.error("SERVER_CRASH_PREVENTED:", {
    message: err.message,
    stack: err.stack, // never send file paths to the client.
    path: req.path,
  });
  //   500 Internal Server Error
  res.status(err.statusCode || 500).json({
    error: {
      type: "InternalError",
      message: "An unexpected error occurred. Please try again later.",
    },
  });
};

module.exports = errorHandler;
