import { checkSchema } from "express-validator";

const registerUserValidator = checkSchema({
  email: {
    isEmail: {
      errorMessage: "invalid email",
    },
    notEmpty: {
      errorMessage: "email is required",
    },
    trim: true,
  },
  firstName: {
    notEmpty: {
      errorMessage: "firstName is required",
    },
    isLength: {
      options: {
        min: 4,
      },
      errorMessage: "firstName should be at leasr 4 chars",
    },
    trim: true,
  },
  lastName: {
    notEmpty: {
      errorMessage: "firstName is required",
    },
    trim: true,
  },
  password: {
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
    trim: true,
  },
});

export default registerUserValidator;
