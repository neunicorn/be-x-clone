import User from "../model/user.model.js";
import { ResponseError } from "../error/response-error.js";
import {
  logoutUserValidation,
  signinUserValidation,
  signupUserValidation,
} from "../validation/auth.validation.js";
import { validate } from "../validation/validation.js";
import bcrypt from "bcrypt";

const signup = async (request) => {
  console.log("USER SERVICE IN");
  const user = validate(signupUserValidation, request);

  console.log("VALIDATION COMPLETE");

  const checkUser = await User.findOne({ username: user.username });
  if (checkUser) {
    throw new ResponseError(400, "Username Already Exists");
  }
  const checkEmail = await User.findOne({ email: user.email });
  if (checkEmail) {
    throw new ResponseError(400, "Email Already Taken");
  }

  //hash password
  user.password = await bcrypt.hash(user.password, 10);

  const createUser = new User(user);

  if (createUser) {
    await createUser.save();
  }

  return createUser;
};

const signin = async (request) => {
  const data = validate(signinUserValidation, request);

  const user = await User.findOne({ username: data.username });
  const email = await User.findOne({ email: data.email });

  if (!(user || email)) {
    throw new ResponseError(400, "invalid username or password");
  }

  let userLogin = "";
  if (user) {
    userLogin = user;
  } else {
    userLogin = email;
  }

  const isPasswordCorrect = await bcrypt.compare(
    data.password,
    userLogin?.password || ""
  );

  if (!isPasswordCorrect) {
    throw new ResponseError(400, "Invalid Username or Password");
  }

  return userLogin;
};

const logout = async (user, res) => {
  const data = validate(logoutUserValidation, user);
  console.log("");

  const newUser = await User.findById(user);

  if (!newUser) {
    throw new ResponseError("404", "USER NOT FOUND");
  }

  res.cookie("jwt", "", { maxAge: 0 });
};

const me = async (user) => {
  const data = validate(logoutUserValidation, user);

  const getUser = await User.findById(user).select("-password");

  if (!getUser) {
    throw new ResponseError("404", "USER NOT FOUND");
  }

  return getUser;
};

export default { signup, signin, logout, me };
