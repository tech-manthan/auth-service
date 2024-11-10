import { Schema } from "express-validator";
import { Roles } from "../../constants";

function emailPasswordSchema(optional: boolean = false): Schema {
  return {
    email: {
      trim: true,
      notEmpty: {
        errorMessage: "email is required",
      },
      isEmail: {
        errorMessage: "invalid email",
      },
      optional: optional,
    },
    password: {
      trim: true,
      notEmpty: {
        errorMessage: "Password is required",
      },
      isLength: {
        options: { min: 8, max: 20 },
        errorMessage: "Password should be at least 8 chars & at most 20 chars",
      },
      matches: {
        options: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])/,
        errorMessage:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      },
      optional: optional,
    },
  };
}

function tenantIdSchema(optional: boolean = false): Schema {
  return {
    tenantId: {
      notEmpty: {
        errorMessage: "tenantId is required",
      },
      isInt: {
        options: {
          min: 1,
        },
        errorMessage: "Id must be a positive integer",
      },
      optional: optional,
    },
  };
}

function firstNameLastNameSchema(optional: boolean = false): Schema {
  return {
    firstName: {
      trim: true,
      notEmpty: {
        errorMessage: "firstName is required",
      },
      isLength: {
        options: {
          min: 4,
        },
        errorMessage: "firstName should be at least 4 chars",
      },
      optional: optional,
    },
    lastName: {
      trim: true,

      notEmpty: {
        errorMessage: "lastName is required",
      },
      optional: optional,
    },
  };
}

function roleSchema(optional: boolean = false): Schema {
  return {
    role: {
      trim: true,
      notEmpty: {
        errorMessage: "role is required",
      },
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

      optional: optional,
    },
  };
}

function nameAddressSchema(optional: boolean = false): Schema {
  return {
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
      optional: optional,
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
      optional: optional,
    },
  };
}

function idSchema(optional: boolean = false): Schema {
  return {
    id: {
      in: ["params"],
      isInt: {
        options: {
          min: 1,
        },
        errorMessage: "Id must be a positive integer",
      },
      toInt: true,
      optional: optional,
    },
  };
}

export {
  emailPasswordSchema,
  tenantIdSchema,
  firstNameLastNameSchema,
  roleSchema,
  nameAddressSchema,
  idSchema,
};
