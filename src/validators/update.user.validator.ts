import { checkSchema } from "express-validator";
import { Roles } from "../constants";

const updateUserValidator = checkSchema({
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
    optional: true,
  },
  lastName: {
    trim: true,

    notEmpty: {
      errorMessage: "firstName is required",
    },
    optional: true,
  },
  role: {
    trim: true,
    isIn: {
      options: [[Roles.ADMIN, Roles.CUSTOMER, Roles.MANAGER]],
      errorMessage: "role must be one of: manager, customer, or admin",
    },
    custom: {
      options: (value, { req }) => {
        if (
          value === Roles.MANAGER &&
          !(req.body as Record<string, string>).tenantId
        ) {
          throw new Error("tenantId is required when role is manager");
        } else if (
          (value === Roles.CUSTOMER || value === Roles.ADMIN) &&
          (req.body as Record<string, string>).tenantId
        ) {
          throw new Error(
            "tenantId is not required when role is customer or admin",
          );
        }
        return true;
      },
    },
    notEmpty: {
      errorMessage: "role is required",
    },
    optional: true,
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
    optional: true,
  },
});

export default updateUserValidator;
