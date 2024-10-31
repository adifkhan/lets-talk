import React from "react";
import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import { GlobalState } from "../context/chatContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { auth } = GlobalState();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (auth?._id) navigate("/chats");
  }, [auth?._id, navigate]);

  return (
    <div
      style={{
        backgroundImage: "url(/chat-bg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
      }}
    >
      <Container maxW="xl" centerContent>
        <Box w={"100%"} p={3} m={"40px 0 15px 0"} bg="white" borderRadius="md">
          <Text fontSize={"4xl"} textAlign={"center"}>
            LET's TALK
          </Text>
        </Box>
        <Box w={"100%"} p={4} bg={"white"} borderRadius={"md"}>
          <Tabs variant="soft-rounded" colorScheme="teal">
            <TabList>
              <Tab w={"50%"} textTransform={"uppercase"}>
                Login
              </Tab>
              <Tab w={"50%"} textTransform={"uppercase"}>
                Register
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <Register />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </div>
  );
};

export default Home;
