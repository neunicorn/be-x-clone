import notificationServices from "../services/notification.services.js";

const getNotification = async (req, res, next) => {
  try {
    const { user_id } = req.jwt;

    const result = await notificationServices.getNotificationService(user_id);

    return res.status(200).json({
      status: true,
      code: 200,
      message: "NOTIFICATION SEND",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteNotification = async (req, res, next) => {
  try {
    const { user_id } = req.jwt;

    const result = await notificationServices.deleteNotificationService(
      user_id
    );

    res.status(200).json({
      status: true,
      message: "NOTIFICATION DELETED",
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getNotification,
  deleteNotification,
};
