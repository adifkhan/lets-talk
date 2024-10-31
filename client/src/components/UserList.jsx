import { Avatar, Box, Text } from "@chakra-ui/react";
import React from "react";
import { GlobalState } from "../context/chatContext";
import { axios } from "../utils/axios";
import { existInNotifications } from "../utils/myFunc";

const UserList = ({ user, notifications, handleNotification, onClose, type = "" }) => {
  const { auth, currentChat, setCurrentChat, refetch, setRefetch } = GlobalState();

  const getSelectedUserChat = async (userId) => {
    try {
      const { data } = await axios.post("/chats", { userId });
      setCurrentChat(data);
      setRefetch(!refetch);
    } catch (error) {
      console.log(error);
    } finally {
      onClose();
    }
  };

  return (
    <>
      {type === "user" ? (
        <Box
          width="100%"
          display="flex"
          alignItems="center"
          gap={3}
          cursor="pointer"
          background={"#E8E8E8"}
          _hover={{ background: "#38B2AC", color: "white" }}
          p={"5px 10px"}
          borderRadius="sm"
          onClick={() => getSelectedUserChat(user?._id)}
        >
          <Avatar name={user?.name} src={user?.profilePic} size="sm" cursor="pointer" />
          <Box>
            <Text fontWeight={500}>{user?.name}</Text>
            <Text whiteSpace="nowrap" fontSize="sm">
              {user?.email}
            </Text>
          </Box>
        </Box>
      ) : (
        <Box
          width="100%"
          display="flex"
          alignItems="center"
          gap={3}
          cursor="pointer"
          background={
            user?._id === currentChat?._id
              ? "#38B2AC"
              : existInNotifications(notifications, user)
              ? "teal.50"
              : "#E8E8E8"
          }
          _hover={{ background: "#38B2AC", color: "white" }}
          p={"5px 10px"}
          borderRadius="sm"
          onClick={() => {
            setCurrentChat(user);
            handleNotification(user?._id);
          }}
        >
          <Avatar
            name={user?.users?.[0]?.name}
            src={user?.users?.[0]?.profilePic}
            size="sm"
            cursor="pointer"
          />
          <Box>
            <Text fontWeight={600}>{user?.users?.[0]?.name}</Text>
            <Text
              sx={{
                whiteSpace: "nowrap",
                fontSize: "sm",
                fontWeight: existInNotifications(notifications, user) ? 600 : 400,
                maxW: "220px",
                isTruncated: true,
              }}
            >
              {user?.latestMessage
                ? (user?.latestMessage?.sender?._id === auth?._id
                    ? `you`
                    : user?.latestMessage?.sender?.name.split(" ")[0]) +
                  ` : ` +
                  user?.latestMessage?.content
                : `email : ${user?.users?.[0]?.email}`}
            </Text>
          </Box>
        </Box>
      )}
    </>
  );
};

export default UserList;
