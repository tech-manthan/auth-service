import { checkSchema } from "express-validator";

const createUserValidator = checkSchema({
  email: {
    trim: true,

    isEmail: {
      errorMessage: "invalid email",
    },
    notEmpty: {
      errorMessage: "email is required",
    },
  },
  firstName: {
    trim: true,
    notEmpty: {
      errorMessage: "firstName is required",
    },
    isLength: {
      options: {
        min: 4,
      },
      errorMessage: "firstName should be at leasr 4 chars",
    },
  },
  lastName: {
    trim: true,

    notEmpty: {
      errorMessage: "firstName is required",
    },
  },
  password: {
    trim: true,
    isLength: {
      options: { min: 8, max: 20 },
      errorMessage: "Password should be at least 8 chars & at most 20 chars",
    },
    matches: {
      options: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@$!%*?&#])/,
      errorMessage:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    },
    notEmpty: {
      errorMessage: "Password is required",
    },
  },
  tenantId: {
    isInt: {
      options: {
        min: 1,
      },
      errorMessage: "Id must be a positive integer",
    },
    notEmpty: {
      errorMessage: "tenantId is required",
    },
  },
});

export default createUserValidator;
