export const isSameSenderLastMessage = (messages, msg, i, userId) => {
  return messages[i + 1]?.sender?._id !== msg?.sender?._id && msg?.sender?._id !== userId;
};

export const isSameSender = (messages, msg, i, userId) => {
  return (
    i < messages?.length - 1 &&
    (messages[i + 1]?.sender?._id !== msg?.sender?._id ||
      messages[i + 1]?.sender?._id === undefined) &&
    msg?.sender?._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages?.length - 1 &&
    messages[messages?.length + 1]?.sender?._id !== userId &&
    messages[messages?.length + 1]?.sender?._id
  );
};

export const existInNotifications = (notifications, chat) => {
  return notifications?.some((noti) => noti?.chat === chat?._id);
};
