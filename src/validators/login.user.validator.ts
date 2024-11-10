import { checkSchema } from "express-validator";

const loginUserValidator = checkSchema({
  email: {
    trim: true,

    isEmail: {
      errorMessage: "invalid email",
    },
    notEmpty: {
      errorMessage: "email is required",
    },
  },

  password: {
    trim: true,
    isLength: {
      options: { min: 8, max: 20 },
      errorMessage: "Password should be at least 8 chars & at most 20 chars",
    },
    matches: {
      options: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])/,
      errorMessage:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    },
    notEmpty: {
      errorMessage: "Password is required",
    },
  },
});

export default loginUserValidator;
