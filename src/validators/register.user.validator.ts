import { checkSchema } from "express-validator";
import { emailPasswordSchema, firstNameLastNameSchema } from "./schema";

const registerUserValidator = checkSchema({
  ...emailPasswordSchema(),
  ...firstNameLastNameSchema(),
});

export default registerUserValidator;
