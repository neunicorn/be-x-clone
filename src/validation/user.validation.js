import Joi from "joi";

const usernameValidation = Joi.string().max(200).required();

const idValidation = Joi.string()
  .hex()
  .length(24)
  .message("WRONG ID")
  .required();

const updateProfileValidation = Joi.object({
  fullName: Joi.string().max(200).optional(),
  username: Joi.string().max(35).optional(),
  currentPassword: Joi.string().min(8).optional(),
  newPassword: Joi.string().min(8).optional(),
  email: Joi.string().email().optional(),
  bio: Joi.string().max(200).optional(),
  link: Joi.string().optional(),
});

export { usernameValidation, idValidation, updateProfileValidation };
