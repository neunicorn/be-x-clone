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
import { idValidation } from "../validation/user.validation.js";
import { validate } from "../validation/validation.js";
import { ResponseError } from "../error/response-error.js";

const createPostService = async (request, id) => {
  // validate the ID and DATA REQUEST
  id = validate(idValidation, id);
  request = validate(postValidation, request);

  // check user
  const user = await User.findById(id);

  if (!user) {
    throw new ResponseError(404, "USER NOT FOUND");
  }

  // if(request.img){
  //   const uploadImg = await cloudinary.uploader.upload(request.img);
  //   request.img = uploadImg.secure_url;
  // }

  const newPost = new Post({
    user: user._id,
    text: request.text,
    img: request.img,
  });

  await newPost.save();

  return newPost;
};

/**
 * THIS IS A SERVICE TO CREATE A COMMENT
 *
 * **/
const createCommentService = async (post_id, user_id, text) => {
  //validate

  console.log(typeof text);
  post_id = validate(idValidation, post_id);
  user_id = validate(idValidation, user_id);
  text = validate(commentValidation, text);

  //check user and chek post
  const post = await Post.findById(post_id);
  const user = await User.findById(user_id);

  if (!post) {
    throw new ResponseError(404, "POST NOT FOUND");
  }

  if (!user) {
    throw new ResponseError(404, "USER NOT FOUND");
  }

  //post comment
  const comment = { user: user_id, text };
  post.comments.push(comment);
  await post.save();

  // make notification to user that have post
  const notification = new Notification({
    from: user._id,
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

  if (!user) {
    throw new ResponseError(404, "User Not Found");
  }
  if (!post) {
    throw new ResponseError(404, "POST NOT FOUND");
  }

  const isLiked = post.likes.includes(user._id);

  if (isLiked) {
    //UNLIKED POST
    await Post.findByIdAndUpdate(post_id, { $pull: { likes: user_id } });
    // await Notification.findOneAndDelete({from: user_id, to: post.user, })

    return false;
  } else {
    // LIKE THE POST
    await Post.findByIdAndUpdate(post_id, { $push: { likes: user_id } });

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

  const user = await User.findById(user_id).select("-password");
  if (!user) {
    throw new ResponseError(404, "USER NOT FOUND");
  }

  const post = await Post.findById(post_id);
  if (!post) {
    throw new ResponseError(404, "POST NOT FOUND");
  }

  if (post.user.toString() !== user._id.toString()) {
    throw new ResponseError(401, "CANNOT DELETE POST");
  }

  if (post.img) {
    await cloudinary.uploader.destroy(post.img.split("/").pop().split(".")[0]);
  }

  await Post.findByIdAndDelete(post_id);
};

export default {
  createPostService,
  createCommentService,
  likeUnlikePostService,
  deletePostService,
};
