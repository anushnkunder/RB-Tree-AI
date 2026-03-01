// Centralized error handling

const errorMessages = {
  DUPLICATE_VALUE: 'Value already exists in the tree. Duplicates not allowed.',
  SIZE_LIMIT: 'Tree size limit reached (1000 nodes). Cannot insert more.',
  INVALID_INPUT: 'Please enter a valid integer value between -10000 and 10000.',
  NOT_FOUND: 'Value not found in the tree.',
  INVALID_TREE_TYPE: 'Invalid tree type. Must be RB, AVL, or BST.',
  IMPORT_VALIDATION_FAILED: 'Invalid JSON format or operation sequence.',
  DATABASE_ERROR: 'Database operation failed.'
};

const handleError = (error, res) => {
  console.error('Error:', error);

  let statusCode = 500;
  let errorCode = 'UNKNOWN_ERROR';
  let message = 'An unexpected error occurred.';

  if (error.message && errorMessages[error.message]) {
    statusCode = 400;
    errorCode = error.message;
    message = errorMessages[error.message];
  } else if (error.message) {
    statusCode = 400;
    errorCode = 'VALIDATION_ERROR';
    message = error.message;
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }
  });
};

module.exports = { handleError, errorMessages };
