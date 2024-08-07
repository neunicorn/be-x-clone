import userServices from "../services/user.services.js";

const getUserProfile = async (req, res, next) => {
  try {
    const { username } = req.params;
    console.log(username);
    const result = await userServices.getUserProfile(username);

    return res.status(200).json({
      status: true,
      message: "GET PROFILE SUCCESS",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getSuggestedProfile = async (req, res, next) => {
  try {
    const { user_id } = req.jwt;

    const result = await userServices.getSuggestedProfile(user_id);

    return res.status(200).json({
      status: true,
      message: "SUGGESTED USER FETCH SUCCESS",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const followOrUnfollow = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user_id } = req.jwt;

    const result = await userServices.followOrUnfollow(id, user_id);

    let resMsg = "";

    if (result) {
      resMsg = "FOLLOWING USER SUCCESS";
    } else {
      resMsg = "UNFOLLOWING USER SUCCESS";
    }

    return res.status(200).json({
      status: true,
      message: resMsg,
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    console.log("MASUK BRO KE UPDATE");
    const { user_id } = req.jwt;
    const data = req.body;
    const image = req.file;

    const result = await userServices.updateProfile(data, user_id, image);

    delete result.password;

    return res.status(200).json({
      status: true,
      message: "UPDATE PROFILE SUCCESS",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getUserProfile,
  getSuggestedProfile,
  followOrUnfollow,
  updateProfile,
};
