import { Box, VStack, Text, Button, useToast } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { axios } from "../utils/axios";
import { GlobalState } from "../context/chatContext";
import UserList from "./UserList";
import GroupList from "./GroupList";
import GroupInfoModal from "./misc/GroupInfoModal";

const LeftBar = () => {
  const toast = useToast();
  const { currentChat, refetch, notifications, setNotifications } = GlobalState();
  const [myChats, setMyChats] = React.useState([]);

  useEffect(() => {
    const getMyChats = async () => {
      try {
        const { data } = await axios.get("/chats");
        setMyChats(data);
      } catch (error) {
        console.log(error);
      } finally {
      }
    };
    getMyChats();
  }, [refetch]);

  const handleNotification = async (chatId) => {
    if (!chatId) return;
    try {
      await axios.patch(`/notification/${chatId}`);
      setNotifications((prev) => prev?.filter((n) => n?.chat !== chatId));
    } catch (error) {
      toast({
        title: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      sx={{
        display: { base: currentChat ? "none" : "flex", md: "flex" },
        flexDir: "column",
        width: { base: "100%", md: "300px", lg: "400px" },
        bg: "white",
        p: { base: "10px", md: "12px 20px 20px" },
        borderRadius: "sm",
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" gap={2} mb={3}>
        <Text fontSize="xl" fontWeight={600}>
          My Chats
        </Text>
        <GroupInfoModal>
          <Button size="sm">+ Create Group</Button>
        </GroupInfoModal>
      </Box>
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        <VStack spacing={0.5}>
          {myChats.map((chat) =>
            chat.isGroupChat ? (
              <GroupList
                key={chat._id}
                group={chat}
                notifications={notifications}
                handleNotification={handleNotification}
              />
            ) : (
              <UserList
                key={chat._id}
                user={chat}
                notifications={notifications}
                handleNotification={handleNotification}
              />
            )
          )}
        </VStack>
      </Box>
    </Box>
  );
};

export default LeftBar;
