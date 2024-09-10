import postServices from "../services/post.services.js";

const getAllPost = async (req, res, next) => {
  try {
    const result = await postServices.getAllPost();

    return res.status(200).json({
      status: true,
      message: "FETCH DATA SUCCESS",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getOnePost = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const result = await postServices.getOnePost(postId, user_id);

    return res.status(200).json({
      status: true,
      message: "FETCH DATA SUCCES",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getUserPosts = async (req, res, next) => {
  try {
    const { username } = req.params;

    const result = await postServices.getUserPostsService(username);

    return res.status(200).json({
      status: true,
      code: 200,
      message: `GET POST USER: ${username.toUpperCase()} SUCCESS`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getFollowingPost = async (req, res, next) => {
  try {
    const { user_id } = req.jwt;
    const result = await postServices.getFollowingPostService(user_id);

    let msg = "";
    if (result.length === 0) {
      msg = "USER NOT FOLLOWING ANYONE";
    } else {
      msg = "FETH DATA SUCCESS";
    }

    return res.status(200).json({
      status: true,
      code: 200,
      message: msg,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getLikedPost = async (req, res, next) => {
  try {
    //todo
    const { userId } = req.params;

    const result = await postServices.getLikedPostService(userId);

    return res.status(200).json({
      status: true,
      message: "DATA FETCHED",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const createPost = async (req, res, next) => {
  try {
    // TODO
    const { user_id } = req.jwt;
    const data = req.body;
    console.log(`data pada controller ${data[0]}`);

    const result = await postServices.createPostService(data, user_id);

    return res.status(201).json({
      status: true,
      message: "POST CREATED",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const createCommentPost = async (req, res, next) => {
  try {
    const { user_id } = req.jwt;
    const { id } = req.params;
    const { text } = req.body;

    const result = await postServices.createCommentService(id, user_id, text);

    return res.status(201).json({
      status: true,
      message: "CREATE COMMENT SUCCES",
    });
  } catch (error) {
    next(error);
  }
};

const likeUnlikePost = async (req, res, next) => {
  try {
    //todo
    const { user_id } = req.jwt;
    const { id } = req.params;

    const { resultLiked, updatedLikes } =
      await postServices.likeUnlikePostService(id, user_id);

    let resultMsg = "";

    if (resultLiked) {
      resultMsg = "POST LIKED";
    } else {
      resultMsg = "POST UNLIKED";
    }

    return res.status(200).json({
      status: true,
      message: resultMsg,
      data: updatedLikes,
    });
  } catch (error) {
    next(error);
  }
};
const deletePost = async (req, res, next) => {
  try {
    //todo
    const { id } = req.params;
    const { user_id } = req.jwt;

    const result = await postServices.deletePostService(id, user_id);

    return res.status(200).json({
      status: true,
      message: "POST DELETED",
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllPost,
  getOnePost,
  getUserPosts,
  getFollowingPost,
  getLikedPost,
  createPost,
  createCommentPost,
  likeUnlikePost,
  deletePost,
};
