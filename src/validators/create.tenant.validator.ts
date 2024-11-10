import { checkSchema } from "express-validator";
import { nameAddressSchema } from "./schema";

const createTenantValidator = checkSchema({
  ...nameAddressSchema(),
});

export default createTenantValidator;
