import Joi from "joi";

const usernameValidation = Joi.string().max(200).required();

const idValidation = Joi.string().hex().length(24).message("WRONG ID");

export { usernameValidation, idValidation };
