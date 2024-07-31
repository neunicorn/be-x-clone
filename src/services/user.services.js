import { ResponseError } from "../error/response-error.js";
import Notification from "../model/notification.model.js";
import User from "../model/user.model.js";
import {
  idValidation,
  usernameValidation,
} from "../validation/user.validation.js";
import { validate } from "../validation/validation.js";
import mongoose from "mongoose";

const getUserProfile = async (username) => {
  const data = validate(usernameValidation, username);

  const profile = await User.findOne({ username }).select("-password");
  if (!profile) {
    throw new ResponseError("404", "USER NOT FOUND");
  }

  return profile;
};

const getSuggestedProfile = async (user_id) => {
  user_id = validate(idValidation, user_id);

  const userAlreadyFollowed = await User.findById(user_id).select("following");

  console.log(user_id);

  const users = await User.aggregate([
    {
      $match: {
        _id: { $ne: new mongoose.Types.ObjectId(user_id) },
      },
    },
    {
      $sample: { size: 10 },
    },
  ]);

  const filterUsers = users.filter(
    (user) => !userAlreadyFollowed.following.includes(user._id)
  );

  const suggestedUser = filterUsers.slice(0, 4);

  suggestedUser.forEach((user) => delete user.password);

  return suggestedUser;
};

const followOrUnfollow = async (id, user_id) => {
  // CHECK IF DATA NULL OR NOT
  const currentUserId = validate(idValidation, user_id);
  const userTargetId = validate(idValidation, id);

  // Check Data on DATABASE
  const userToModify = await User.findById(userTargetId);
  const currentUser = await User.findById(currentUserId);

  if (id === user_id) {
    throw new ResponseError(400, "YOU CAN'T FOLLOW YOUR SELF");
  }

  if (!(userToModify && currentUser)) {
    throw new ResponseError(404, "USER NOT FOUND");
  }

  const isFollowing = currentUser.following.includes(id);

  if (isFollowing) {
    await User.findByIdAndUpdate(id, { $pull: { followers: user_id } });
    await User.findByIdAndUpdate(user_id, { $pull: { following: id } });

    return false;
  } else {
    // follow
    await User.findByIdAndUpdate(id, { $push: { followers: user_id } });
    await User.findByIdAndUpdate(user_id, { $push: { following: id } });

    // TODO: SEND NOTIFICATION TO TARGET USER

    const newNotification = new Notification({
      type: "follow",
      from: currentUserId,
      to: userTargetId,
    });

    await newNotification.save();

    return true;
  }
};

const updateProfile = async (id) => {};

export default {
  getUserProfile,
  getSuggestedProfile,
  followOrUnfollow,
  updateProfile,
};
