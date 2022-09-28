import { NotificationManager } from "react-notifications";

export const CustomeNotification = (
  type = "success",
  title = "Title",
  msg = "Successfully",
  time = 1500,
  callBack = () => {}
) => {
  switch (type) {
    case "info":
      NotificationManager.info(title, msg, time, callBack);
      break;
    case "success":
      NotificationManager.success(title, msg, time, callBack);
      break;
    case "warning":
      NotificationManager.warning(title, msg, time, callBack);
      break;
    case "error":
      NotificationManager.error(title, msg, time, callBack);
      break;
    default:
      return NotificationManager.success(title, msg, time, callBack);
  }
};
