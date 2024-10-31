import { Box, FormControl, IconButton, Input, Text, useToast } from "@chakra-ui/react";
import React from "react";
import { GlobalState } from "../context/chatContext";
import ProfileModal from "./misc/ProfileModal";
import { FaLongArrowAltLeft } from "react-icons/fa";
import ChatGallery from "./ChatGallery";
import GroupInfoModal from "./misc/GroupInfoModal";
import { IoSend } from "react-icons/io5";
import { axios } from "../utils/axios";
import { io } from "socket.io-client";
import TypingSpinner from "./loader/TypingSpinner";

const end_point = process.env.REACT_APP_END_POINT;
let socket, chatCompare;

const MessageBox = () => {
  const toast = useToast();
  const {
    auth,
    currentChat,
    setCurrentChat,
    refetch,
    setRefetch,
    notifications,
    setNotifications,
  } = GlobalState();
  const [messageText, setMessageText] = React.useState("");
  const [messages, setMessages] = React.useState([]);
  const [socketConn, setSocketConn] = React.useState(false);
  const [typing, setTyping] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);

  // socket.io
  React.useEffect(() => {
    socket = io(end_point);
    socket.emit("setup", auth);
    socket.on("connected", () => setSocketConn(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("not typing", () => setIsTyping(false));
  }, [auth]);
  React.useEffect(() => {
    socket.on("message received", (newMessage) => {
      if (!chatCompare || chatCompare._id !== newMessage.chat._id) {
        if (!notifications?.includes(newMessage)) {
          setNotifications([...notifications, newMessage]);
          setRefetch(!refetch);
        }
      } else {
        setMessages([...messages, newMessage]);
      }
    });
  });

  // get messages of current chat
  React.useEffect(() => {
    const getMessages = async () => {
      try {
        const { data } = await axios.get("/message/" + currentChat?._id);
        setMessages(data);

        socket.emit("chat on", currentChat?._id);
      } catch (error) {
        toast({
          title: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };
    currentChat && getMessages();

    chatCompare = currentChat;
  }, [currentChat, toast]);

  const typingHandler = (e) => {
    setMessageText(e.target.value);

    if (!socketConn) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", currentChat?._id);
    }

    const lastKeyStrokeTime = new Date().getTime();
    const duration = 3000;
    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastKeyStrokeTime;

      if (timeDiff >= duration && typing) {
        socket.emit("not typing", currentChat?._id);
        setTyping(false);
      }
    }, duration);
  };

  const sendMessage = async () => {
    socket.emit("not typing", currentChat?._id);
    try {
      const { data } = await axios.post("/message", {
        chatId: currentChat?._id,
        content: messageText,
      });
      socket.emit("new message", data);
      setMessages([...messages, data]);
      setRefetch(!refetch);
    } catch (error) {
      toast({
        title: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setMessageText("");
    }
  };

  return (
    <>
      {currentChat ? (
        <Box
          display={{ base: currentChat ? "flex" : "none", md: "flex" }}
          flexDir="column"
          flex={1}
          bg="white"
          p={{ base: "10px", md: "12px 20px 20px" }}
          borderRadius="sm"
        >
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<FaLongArrowAltLeft />}
              onClick={() => setCurrentChat(null)}
            />
            <Text fontSize="xl" fontWeight={500}>
              {currentChat?.isGroupChat ? currentChat?.chatName : currentChat?.users?.[0]?.name}
            </Text>
            <Box>
              {currentChat?.isGroupChat ? (
                <GroupInfoModal group={currentChat} />
              ) : (
                <ProfileModal user={currentChat?.users?.[0]} />
              )}
            </Box>
          </Box>
          <ChatGallery messages={messages} />
          <Box sx={{ mt: 1, position: "relative" }}>
            {isTyping && (
              <Box sx={{ position: "absolute", top: "-30px", left: 0 }}>
                <TypingSpinner />
              </Box>
            )}
            <FormControl
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 4,
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
            >
              <Input placeholder="write message" value={messageText} onChange={typingHandler} />
              <IconButton colorScheme="teal" icon={<IoSend />} onClick={sendMessage} />
            </FormControl>
          </Box>
        </Box>
      ) : (
        <Box
          display={{ base: "none", md: currentChat ? "none" : "flex" }}
          alignItems="center"
          justifyContent="center"
          flex={1}
          bg="white"
          p={{ base: "10px", md: "12px 20px 20px" }}
          borderRadius="sm"
        >
          Pick a Friend to Start a Chat
        </Box>
      )}
    </>
  );
};

export default MessageBox;
