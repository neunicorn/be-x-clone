import jwt from "jsonwebtoken";

export const jwtAuth = () => {
  return async (req, res, next) => {
    try {
      console.log("INNN TO JWT MIDDLEWARE");
      let authorization = req.cookies.jwt;
      console.log(authorization);
      if (!authorization) {
        throw { code: 401, message: "UNAUTHORIZED" };
      }
      // const token = authorization.split(" ")[1]; THIS WILL USE, IF USING BEARER TOKEN
      const decode = jwt.verify(authorization, process.env.JWT_SECRET);
      req.jwt = decode;
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
