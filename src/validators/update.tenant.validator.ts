import { checkSchema } from "express-validator";

const updateTenantValidator = checkSchema({
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
        "tenant name should be at least 4 characters & at most 100 characters",
    },
    optional: true,
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
    optional: true,
  },
  role: {
    trim: true,
    notEmpty: {
      errorMessage: "tenant address is required",
    },
  },
});

export default updateTenantValidator;
