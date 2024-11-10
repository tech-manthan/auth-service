import { checkSchema } from "express-validator";
import { idSchema } from "./schema";

const idParamValidator = checkSchema({
  ...idSchema(),
});

export default idParamValidator;
