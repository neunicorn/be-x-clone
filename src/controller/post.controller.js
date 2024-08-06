import postServices from "../services/post.services.js";

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

    const result = await postServices.likeUnlikePostService(id, user_id);

    let resultMsg = "";

    if (result) {
      resultMsg = "POST LIKED";
    } else {
      resultMsg = "POST UNLIKED";
    }

    return res.status(200).json({
      status: true,
      message: resultMsg,
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
  createPost,
  createCommentPost,
  likeUnlikePost,
  deletePost,
};
