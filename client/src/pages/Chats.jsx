import { Box } from "@chakra-ui/react";
import React from "react";
import TopBar from "../components/TopBar";
import LeftBar from "../components/LeftBar";
import MessageBox from "../components/MessageBox";
import { GlobalState } from "../context/chatContext";
import { useNavigate } from "react-router-dom";

const Chats = () => {
  const { auth } = GlobalState();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!auth) navigate("/");
  }, [auth, navigate]);

  return (
    <div
      style={{
        backgroundImage: "url(/chat-bg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <TopBar />
      <Box
        display="flex"
        justifyContent="space-between"
        gap={2}
        width="100%"
        height="calc(100vh - 50px)"
        minHeight="400px"
        p="10px"
      >
        <LeftBar />
        <MessageBox />
      </Box>
    </div>
  );
};

export default Chats;
