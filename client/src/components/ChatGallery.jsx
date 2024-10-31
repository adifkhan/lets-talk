import { Avatar, Box, Tooltip } from "@chakra-ui/react";
import React from "react";
import MessageItem from "./MessageItem";
import { isLastMessage, isSameSender } from "../utils/myFunc";
import { GlobalState } from "../context/chatContext";

const ChatGallery = ({ messages }) => {
  const { auth } = GlobalState();

  const scrollRef = React.useRef(null);

  // Scroll to the bottom on the first render
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Box
      ref={scrollRef}
      sx={{
        flex: 1,
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        msOverflowStyle: "none",
        scrollbarWidth: "none",

        display: "flex",
        flexDirection: "column",
        gap: 1,
        width: "100%",
        bgColor: "#E8E8E8",
        p: 3,
        borderRadius: "sm",
      }}
    >
      <Box sx={{ flex: 1 }}></Box>
      {messages &&
        messages.map((msg, i) => (
          <Box
            key={msg._id}
            sx={{
              display: "flex",
            }}
          >
            {isSameSender(messages, msg, i, auth?._id) || isLastMessage(messages, i, auth?._id) ? (
              <Tooltip label={msg.sender.name}>
                <Avatar
                  name={msg?.sender.name}
                  src={msg?.sender.profilePic}
                  size="xs"
                  mt={1}
                  cursor="pointer"
                />
              </Tooltip>
            ) : (
              <Box width={6} height={6}></Box>
            )}
            <MessageItem item={msg} />
          </Box>
        ))}
    </Box>
  );
};

export default ChatGallery;
