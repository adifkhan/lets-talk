import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { IoChevronDownCircleOutline, IoSearch } from "react-icons/io5";
import { GlobalState } from "../context/chatContext";
import { axios } from "../utils/axios";
import { useNavigate } from "react-router-dom";
import ProfileModal from "./misc/ProfileModal";
import SideDraware from "./misc/SideDraware";

const TopBar = () => {
  const navigate = useNavigate();
  const { auth, setAuth, setCurrentChat } = GlobalState();

  const handleLogout = async () => {
    await axios.post("/auth/logout");
    setCurrentChat(null);
    setAuth(null);
    navigate("/");
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      p={"5px 10px"}
      bg="white"
    >
      <SideDraware>
        <IoSearch />
        <Text display={{ base: "none", md: "flex" }} px={3} color={"gray"} fontWeight={400}>
          Search Users
        </Text>
      </SideDraware>
      <Text fontSize="2xl" fontWeight={500}>
        LET's TALK
      </Text>

      <Menu>
        <MenuButton as={Button} rightIcon={<IoChevronDownCircleOutline size={12} />}>
          <Avatar name={auth?.name} src={auth?.profilePic} size="xs" cursor="pointer" />
        </MenuButton>
        <MenuList>
          <ProfileModal user={auth}>
            <MenuItem>My Profile</MenuItem>
          </ProfileModal>
          <MenuDivider />
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
};

export default TopBar;
