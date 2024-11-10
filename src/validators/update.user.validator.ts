import { checkSchema } from "express-validator";
import { firstNameLastNameSchema, roleSchema, tenantIdSchema } from "./schema";

const updateUserValidator = checkSchema({
  ...firstNameLastNameSchema(true),
  ...roleSchema(true),
  ...tenantIdSchema(true),
});

export default updateUserValidator;
