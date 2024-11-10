import { checkSchema } from "express-validator";
import { nameAddressSchema } from "./schema";

const updateTenantValidator = checkSchema({
  ...nameAddressSchema(true),
});

export default updateTenantValidator;
