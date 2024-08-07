import jwt from "jsonwebtoken";
import User from "../model/user.model.js";
import { ResponseError } from "../error/response-error.js";

export const jwtAuth = () => {
  return async (req, res, next) => {
    try {
      let authorization = req.cookies.jwt;
      if (!authorization) {
        throw { code: 401, message: "UNAUTHORIZED" };
      }
      // const token = authorization.split(" ")[1]; THIS WILL USE, IF USING BEARER TOKEN
      const decode = jwt.verify(authorization, process.env.JWT_SECRET);
      req.jwt = decode;
      const checkUser = await User.findById(req.jwt.user_id).select(
        "-password"
      );
      if (!checkUser) {
        throw new ResponseError("404", "USER NOT FOUND");
      }
      next();
    } catch (err) {
      const errMessage = [
        "invalid signature",
        "jwt malformed",
        "jwt must be provided",
        "invalid token",
      ];
      if (err.message === "jwt expired") {
        err.message = "TOKEN_EXPIRED";
      } else if (errMessage.includes(err.message)) {
        err.message = "INVALID_TOKEN";
      }
      return res.status(err.code || 500).json({
        status: false,
        message: err.message,
      });
    }
  };
};
