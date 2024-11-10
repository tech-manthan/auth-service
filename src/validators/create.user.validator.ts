import { checkSchema } from "express-validator";
import {
  emailPasswordSchema,
  firstNameLastNameSchema,
  roleSchema,
  tenantIdSchema,
} from "./schema";

const createUserValidator = checkSchema({
  ...emailPasswordSchema(),
  ...firstNameLastNameSchema(),
  ...roleSchema(),
  ...tenantIdSchema(true),
});

export default createUserValidator;
