import { Avatar, Box, Text } from "@chakra-ui/react";
import React from "react";
import { GlobalState } from "../context/chatContext";
import { existInNotifications } from "../utils/myFunc";

const GroupList = ({ group, notifications, handleNotification }) => {
  const { auth, currentChat, setCurrentChat } = GlobalState();

  return (
    <Box
      width="100%"
      display="flex"
      alignItems="center"
      gap={3}
      cursor="pointer"
      background={
        group?._id === currentChat?._id
          ? "#38B2AC"
          : existInNotifications(notifications, group)
          ? "teal.50"
          : "#E8E8E8"
      }
      _hover={{ background: "#38B2AC", color: "white" }}
      p={"5px 10px"}
      borderRadius="sm"
      onClick={() => {
        setCurrentChat(group);
        handleNotification(group?._id);
      }}
    >
      <Avatar name={group?.chatName} src={group?.profilePic} size="sm" cursor="pointer" />
      <Box>
        <Text fontWeight={500}>{group?.chatName}</Text>

        <Text
          sx={{
            whiteSpace: "nowrap",
            fontSize: "sm",
            fontWeight: existInNotifications(notifications, group) ? 600 : 400,
            maxW: "220px",
            isTruncated: true,
          }}
        >
          {group?.latestMessage
            ? (group?.latestMessage?.sender?._id === auth?._id
                ? `you`
                : group?.latestMessage?.sender?.name.split(" ")[0]) +
              ` : ` +
              group?.latestMessage?.content
            : `${group?.users?.length} members`}
        </Text>
      </Box>
    </Box>
  );
};

export default GroupList;
