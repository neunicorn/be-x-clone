import Notification from "../model/notification.model.js";
import { idValidation } from "../validation/user.validation.js";
import { validate } from "../validation/validation.js";

const getNotificationService = async (user_id) => {
  //validate user_id
  user_id = validate(idValidation, user_id);

  //get notification
  const notifications = await Notification.find({ to: user_id }).populate({
    path: "from",
    select: "username, fullName, profileImg",
  });

  //upadte notification READ status
  await Notification.updateMany({ to: user_id }, { read: true });

  return notifications;
};
const deleteNotificationService = async (user_id) => {
  //validate id pattern
  user_id = validate(idValidation, user_id);

  //delete notification
  await Notification.deleteMany({ to: user_id });
};

export default { getNotificationService, deleteNotificationService };
