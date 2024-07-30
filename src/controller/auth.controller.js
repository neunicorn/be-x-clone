import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import userService from "../services/user.services.js";

const signup = async (req, res, next) => {
  try {
    console.log("REQUEST MASUK");
    const data = req.body;
    const result = await userService.signup(data);

    generateTokenAndSetCookie(result._id, res);

    return res.status(201).json({
      status: true,
      message: "USER_CREATED_SUCCESSFULLY",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const signin = async (req, res, next) => {
  try {
    const data = req.body;
    const result = await userService.signin(data, res);

    generateTokenAndSetCookie(result._id, res);

    return res.status(200).json({
      status: true,
      message: "USER_LOGGEDIN_SUCCESSFULLY",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const user = req.jwt.user_id;
    console.log(user);
    const result = await userService.logout(user, res);

    return res.status(200).json({
      status: true,
      message: "LOGGED OUT SUCCESSFULLY",
    });
  } catch (error) {
    next(error);
  }
};

export default {
  signup,
  signin,
  logout,
};
