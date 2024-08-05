//module import
import { ResponseError } from "../error/response-error.js";
import Notification from "../model/notification.model.js";
import User from "../model/user.model.js";
import {
  idValidation,
  updateProfileValidation,
  usernameValidation,
} from "../validation/user.validation.js";
import { validate } from "../validation/validation.js";

// library import
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";

const getUserProfile = async (username) => {
  const data = validate(usernameValidation, username);

  const profile = await User.findOne({ username }).select("-password");
  if (!profile) {
    throw new ResponseError(404, "USER NOT FOUND");
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

const updateProfile = async (request, id, image) => {
  //DATA VALIDATION
  let data = validate(updateProfileValidation, request);
  let user_id = validate(idValidation, id);
  let avatar = image;

  // CHECK USER
  let user = await User.findById(user_id);
  if (!user) {
    throw new ResponseError(404, "USER NOT FOUND");
  }

  //  UPDATE PASSWORD

  if (
    (!data.newPassword && data.currentPassword) ||
    (!data.currentPassword && data.newPassword)
  ) {
    throw new ResponseError(
      400,
      "PLEASE PROVIDE BOTH CURRENT PASSWORD AND NEW PASSWORD"
    );
  }

  if (data.currentPassword && data.newPassword) {
    const isMatch = await bcrypt.compare(data.currentPassword, user.password);
    if (!isMatch) {
      throw new ResponseError(400, "WRONG PASSWORD");
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(data.newPassword, salt);
  }

  //UPDATE EMAIL
  if (data.email) {
    const checkEmail = await User.findOne({ email: data.email });
    if (checkEmail) {
      throw new ResponseError(400, "EMAIL ALREADY USED");
    }
    user.email = data.email;
  }

  //UPDATE USERNMAE
  if (data.username) {
    const checkUsername = await User.findOne({ username: data.username });
    if (checkUsername) {
      throw new ResponseError(400, "USERNAME ALREADY USED");
    }
    user.username = data.username;
  }

  //UPDATE profileImg
  if (data.profileImg) {
    if (user.profileImg) {
      await cloudinary.uploader.destroy(
        user.profileImg.split("/").pop().split(".")[0]
      );
    }
    const uploadImg = await cloudinary.uploader.upload(avatar);
    user.profileImg = uploadImg.secure_url;
  }

  // UPDATE BANNER
  if (data.coverImg) {
    if (user.coverImg) {
      await cloudinary.uploader.destroy(
        user.coverImg.split("/").pop().split(".")[0]
      );
    }
    const uploadImg = await cloudinary.uploader.upload(avatar);
    user.coverImg = uploadImg.secure_url;
  }

  //Update full name
  user.fullName = data.fullName || user.fullName;

  //update bio
  user.bio = data.bio || user.bio;

  // update link

  user.link = data.link || user.link;

  user = await user.save();

  return user;
};

export default {
  getUserProfile,
  getSuggestedProfile,
  followOrUnfollow,
  updateProfile,
};
