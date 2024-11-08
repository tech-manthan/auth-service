import { checkSchema } from "express-validator";

const idParamValidator = checkSchema({
  id: {
    in: ["params"],
    isInt: {
      options: {
        min: 1,
      },
      errorMessage: "Id must be a positive integer",
    },
    toInt: true,
  },
});

export default idParamValidator;
