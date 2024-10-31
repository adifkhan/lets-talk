import React from "react";
import { axios } from "../../utils/axios";
import UserList from "../UserList";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Skeleton,
  Stack,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";

const SideDraware = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = React.useState(false);
  const [searchResult, setSearchResult] = React.useState([]);

  const btnRef = React.useRef();

  const handleSearch = async (e) => {
    setLoading(true);
    try {
      const { data } = await axios.get("/user?search=" + e.target.value);
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };
  return (
    <>
      <Button ref={btnRef} onClick={onOpen}>
        {children}
      </Button>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search Users</DrawerHeader>

          <DrawerBody display="flex" flexDirection="column" gap={4}>
            <Box>
              <Input placeholder="Search user by name or email" onChange={handleSearch} />
            </Box>
            {loading ? (
              <Stack spacing={0.5}>
                <Skeleton height="50px" />
                <Skeleton height="50px" />
                <Skeleton height="50px" />
                <Skeleton height="50px" />
                <Skeleton height="50px" />
                <Skeleton height="50px" />
                <Skeleton height="50px" />
              </Stack>
            ) : (
              <VStack spacing={0.5}>
                {searchResult.map((user) => (
                  <UserList key={user._id} user={user} type={"user"} onClose={onClose} />
                ))}
              </VStack>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDraware;
