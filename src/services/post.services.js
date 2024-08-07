// import dependencies
import { v2 as cloudinary } from "cloudinary";

// import module
import Post from "../model/post.model.js";
import User from "../model/user.model.js";
import Notification from "../model/notification.model.js";

import {
  commentValidation,
  postValidation,
} from "../validation/post.validation.js";
import {
  idValidation,
  usernameValidation,
} from "../validation/user.validation.js";
import { validate } from "../validation/validation.js";
import { ResponseError } from "../error/response-error.js";

const getAllPost = async () => {
  const post = await Post.find()
    .sort({ createdAt: -1 })
    .populate({ path: "user", select: "-password" });

  if (!post) {
    throw new ResponseError(404, "FETCH DATA FAILED");
  }

  if (post.length === 0) {
    return [];
  }

  return post;
};

const getOnePost = async (post_id) => {
  // validate id
  post_id = validate(idValidation, post_id);

  // fetch post data by id
  const post = await Post.findById(post_id)
    .populate({
      path: "user",
      select: "-password",
    })
    .populate({
      path: "comments.user",
      select: "-password",
    });
  if (!post) {
    throw new ResponseError(404, "POST NOT FOUND");
  }

  return post;
};

const getUserPostsService = async (username) => {
  // validate username is not nul;
  username = validate(usernameValidation, username);
  //check USERNAME
  //do not delete this
  const user = await User.findOne({ username }).select("-password");
  if (!user) {
    throw new Error(404, "USER NOT FOUND");
  }

  //GET POST BY USER ID
  const post = await Post.find({ user: user._id })
    .select("-password")
    .sort({ createdAt: -1 })
    .populate({ path: "user", select: "-password" })
    .populate({ path: "comments.user", select: "-password" });

  return post;
};

const getFollowingPostService = async (user_id) => {
  //validate id
  user_id = validate(idValidation, user_id);

  //check user;
  const user = await User.findById(user_id).select("-password");

  if (user.following === 0) {
    return [];
  }

  // get post that followed by the user
  const post = await Post.find({ user: { $in: user.following } })
    .sort({ createdAt: -1 })
    .populate({ path: "user", select: "-password" })
    .populate({ path: "comments.user", select: "-password" });

  if (!post) {
    throw new ResponseError(404, "POST NOT FOUND");
  }

  return post;
};

const getLikedPostService = async (user_id) => {
  //validate id
  user_id = validate(idValidation, user_id);

  //get user
  const user = await User.findById(user_id);
  if (!user) {
    throw new ResponseError(404, "USER NOT FOUND");
  }

  //get likedpost by user
  const likedPost = await Post.find({ _id: { $in: user.postLiked } })
    .populate({ path: "user", select: "-password" })
    .populate({ path: "comments.user", select: "-password" });

  console.log(likedPost);
  return likedPost;
};

const createPostService = async (request, id) => {
  // validate the ID and DATA REQUEST
  id = validate(idValidation, id);
  request = validate(postValidation, request);

  // if(request.img){
  //   const uploadImg = await cloudinary.uploader.upload(request.img);
  //   request.img = uploadImg.secure_url;
  // }

  const newPost = new Post({
    user: id,
    text: request.text,
    img: request.img,
  });

  await newPost.save();

  return newPost;
};

/**
 * Service to create comment in a post
 *
 * @param -> `post id`, `user id`, and the `comment` or `text`
 **/
const createCommentService = async (post_id, user_id, text) => {
  //validate

  console.log(typeof text);
  post_id = validate(idValidation, post_id);
  user_id = validate(idValidation, user_id);
  text = validate(commentValidation, text);

  //check user and chek post
  const post = await Post.findById(post_id);

  if (!post) {
    throw new ResponseError(404, "POST NOT FOUND");
  }

  //post comment
  const comment = { user: user_id, text };
  post.comments.push(comment);
  await post.save();

  // make notification to user that have post
  const notification = new Notification({
    from: user_id,
    to: post.user,
    type: "comment",
  });

  await notification.save();
};

const likeUnlikePostService = async (post_id, user_id) => {
  //validate
  post_id = validate(idValidation, post_id);
  user_id = validate(idValidation, user_id);

  // check user and post

  const user = await User.findById(user_id).select("-password");
  const post = await Post.findById(post_id);

  if (!post) {
    throw new ResponseError(404, "POST NOT FOUND");
  }

  const isLiked = post.likes.includes(user._id);

  if (isLiked) {
    //UNLIKED POST
    await Post.findByIdAndUpdate(post_id, { $pull: { likes: user_id } });
    await User.findByIdAndUpdate(user_id, { $pull: { postLiked: post_id } });
    // await Notification.findOneAndDelete({from: user_id, to: post.user, })

    return false;
  } else {
    // LIKE THE POST
    await Post.findByIdAndUpdate(post_id, { $push: { likes: user_id } });
    await User.findByIdAndUpdate(user_id, { $push: { postLiked: post_id } });

    //make notification
    const notification = new Notification({
      type: "like",
      from: user._id,
      to: post.user,
    });
    await notification.save();

    return true;
  }
};

const deletePostService = async (post_id, user_id) => {
  post_id = validate(idValidation, post_id);
  user_id = validate(idValidation, user_id);

  const post = await Post.findById(post_id);
  if (!post) {
    throw new ResponseError(404, "POST NOT FOUND");
  }

  if (post.user.toString() !== user_id) {
    throw new ResponseError(401, "CANNOT DELETE POST");
  }

  if (post.img) {
    await cloudinary.uploader.destroy(post.img.split("/").pop().split(".")[0]);
  }

  await Post.findByIdAndDelete(post_id);
};

export default {
  getOnePost,
  getAllPost,
  getUserPostsService,
  getFollowingPostService,
  getLikedPostService,
  createPostService,
  createCommentService,
  likeUnlikePostService,
  deletePostService,
};
