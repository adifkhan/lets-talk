import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { GlobalState } from "../context/chatContext";

const MessageItem = ({ item }) => {
  const { auth } = GlobalState();
  const [showTime, setShowTime] = React.useState(false);

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDir: "column",
        alignItems: item?.sender?._id === auth?._id ? "flex-end" : "flex-start",
        px: 2,
      }}
    >
      <Box
        sx={{
          maxW: { base: "full", md: "50%" },
          bgColor: item?.sender?._id === auth?._id ? "teal.300" : "green.300",
          p: "3px 10px",
          borderRadius: "md",
        }}
        onClick={() => setShowTime(!showTime)}
      >
        <Text>{item?.content}</Text>
      </Box>
      <Text sx={{ fontSize: "12px", display: showTime ? "block" : "none" }}>
        {new Date(item?.updatedAt).toLocaleTimeString("en-US", {
          hour12: true,
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
    </Box>
  );
};

export default MessageItem;
