import Joi from "joi";

const signupUserValidation = Joi.object({
  username: Joi.string().max(35).required(),
  fullName: Joi.string().max(100).required(),
  password: Joi.string().min(8).required(),
  email: Joi.string().max(200).email().required(),
});

const signinUserValidation = Joi.object({
  username: Joi.string().max(35).optional(),
  email: Joi.string().max(200).email().optional(),
  password: Joi.string().min(8).required(),
});

const logoutUserValidation = Joi.string().required();

export { signupUserValidation, signinUserValidation, logoutUserValidation };
