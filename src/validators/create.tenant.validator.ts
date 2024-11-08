import { checkSchema } from "express-validator";

const createTenantValidator = checkSchema({
  name: {
    trim: true,
    notEmpty: {
      errorMessage: "tenant name is required",
    },
    isLength: {
      options: {
        min: 4,
        max: 100,
      },
      errorMessage:
        "firstName should be at least 4 characters & at most 100 characters",
    },
  },
  address: {
    trim: true,
    notEmpty: {
      errorMessage: "tenant address is required",
    },
    isLength: {
      options: {
        min: 4,
        max: 255,
      },
      errorMessage:
        "addresss should be at least 4 characters & at most 255 characters",
    },
  },
});

export default createTenantValidator;
