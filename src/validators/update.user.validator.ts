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
    custom: {
      options: (value, { req }) => {
        console.log((req.body as Record<string, string>).tenantId);
        if (
          (req.body as Record<string, string>).role === Roles.MANAGER &&
          !(req.body as Record<string, string>).tenantId
        ) {
          throw new Error("tenantId is required when role is manager");
        } else if (
          (req.body as Record<string, string>).role === Roles.CUSTOMER &&
          (req.body as Record<string, string>).tenantId
        ) {
          throw new Error("tenantId is not required when role is customer");
        } else if ((req.body as Record<string, string>).role === Roles.ADMIN) {
          throw new Error("cannot make a user admin");
        }
        return true;
      },
    },
    trim: true,
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
    optional: {
      options: {
        nullable: true,
      },
    },
  },
});

export default updateUserValidator;
