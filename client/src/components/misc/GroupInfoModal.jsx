import {
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  Button,
  FormControl,
  Input,
  Stack,
  Skeleton,
  VStack,
  Box,
  Avatar,
  Text,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { axios } from "../../utils/axios";
import { MdCancel } from "react-icons/md";
import { GlobalState } from "../../context/chatContext";
import { LuView } from "react-icons/lu";

const GroupInfoModal = ({ group, children }) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { setCurrentChat, refetch, setRefetch } = GlobalState();

  const [chatName, setChatName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [searchResult, setSearchResult] = React.useState([]);
  const [resultToShow, setResultToShow] = React.useState([]);
  const [selectedUsers, setSelectedUsers] = React.useState([]);

  React.useEffect(() => {
    setChatName(group?.chatName);
    setSelectedUsers(group?.users ?? []);
  }, [group?.chatName, group?.users]);

  React.useEffect(() => {
    const filteredResult = searchResult.filter(
      (searItm) => !selectedUsers.some((selItm) => selItm._id === searItm._id)
    );
    setResultToShow(filteredResult);
  }, [searchResult, selectedUsers]);

  const handleSearch = async (text) => {
    setLoading(true);
    try {
      const { data } = await axios.get("/user?search=" + text);
      setSearchResult(data);
    } catch (error) {
      console.error(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const unselectUsers = (id) => {
    const restUsers = selectedUsers.filter((user) => user._id !== id);
    setSelectedUsers(restUsers);
  };
  
  const handleSubmit = async () => {
    const users = selectedUsers?.map((user) => user._id);

    try {
      const { data } = await axios.patch("/chats/group?id=" + group?._id, { chatName, users });
      setCurrentChat(data);
      setChatName("");
      setSearchResult([]);
      setSelectedUsers([]);
      setRefetch(!refetch);
      onClose();
      toast({
        title: "Group Updated",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      //   console.log(error);
    }
  };

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton icon={<LuView />} onClick={onOpen} />
      )}
      <Modal size="lg" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">Group Chat Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* input form  */}
            <FormControl id="group-name" isRequired>
              <Input
                placeholder="Enter Group Name"
                mb={2}
                value={chatName}
                onChange={(e) => setChatName(e.target.value)}
              />
            </FormControl>
            <FormControl id="search-member" isRequired>
              <Input
                placeholder="Search Friends"
                mb={2}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {/* selected users  */}
            {selectedUsers?.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 0.5,
                  p: 2,
                  mb: 2,
                  bgColor: "#E8E8E8",
                  borderRadius: "sm",
                }}
              >
                {selectedUsers.map((user) => (
                  <Box
                    key={user?._id}
                    display="flex"
                    alignItems="center"
                    px={1}
                    bg="purple.300"
                    borderRadius="lg"
                    cursor="pointer"
                    onClick={() => unselectUsers(user?._id)}
                  >
                    <Text>{user?.name} </Text>
                    <MdCancel />
                  </Box>
                ))}
              </Box>
            )}

            {/* searched result  */}
            {loading ? (
              <Stack spacing={0.5}>
                <Skeleton height="50px" />
                <Skeleton height="50px" />
                <Skeleton height="50px" />
              </Stack>
            ) : (
              <VStack spacing={0.5}>
                {resultToShow?.slice(0, 3).map((user) => (
                  <Box
                    key={user?._id}
                    width="100%"
                    display="flex"
                    alignItems="center"
                    gap={3}
                    cursor="pointer"
                    background="#E8E8E8"
                    _hover={{ background: "#38B2AC", color: "white" }}
                    p={"5px 10px"}
                    borderRadius="sm"
                    onClick={() => setSelectedUsers([...selectedUsers, user])}
                  >
                    <Avatar name={user?.name} src={user?.profilePic} size="sm" cursor="pointer" />
                    <Box>
                      <Text fontWeight={500}>{user?.name}</Text>
                      <Text fontSize="sm">{user?.email}</Text>
                    </Box>
                  </Box>
                ))}
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleSubmit}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupInfoModal;
