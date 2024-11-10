import { checkSchema } from "express-validator";
import { emailPasswordSchema } from "./schema";

const loginUserValidator = checkSchema({
  ...emailPasswordSchema(),
});

export default loginUserValidator;
