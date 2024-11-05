import {
  Box,
  IconButton,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { LuView, LuCamera } from "react-icons/lu";
import imageUploader from "../../utils/imgUploader";
import { axios } from "../../utils/axios";
import { GlobalState } from "../../context/chatContext";

const ProfileModal = ({ user, children }) => {
  const { auth, setAuth } = GlobalState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [error, setError] = React.useState("");

  const handleImgUpdate = async (img) => {
    if (!img) return;

    let imgUrl;
    imgUrl = await imageUploader(img);

    try {
      const res = await axios.patch("/auth/update/" + auth?._id, { profilePic: imgUrl });

      setAuth(res?.data);
      setError("");
    } catch (error) {
      setError(error?.response?.data?.message);
      // console.log(error);
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
          <ModalHeader display="flex" justifyContent="center">
            {user?.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              pb: 6,
            }}
          >
            <Box
              sx={{
                position: "relative",
              }}
            >
              <Image
                boxSize="150px"
                borderRadius="50%"
                src={user?.profilePic}
                alt={user?.profilePic}
                sx={{ border: "1px dashed gray" }}
              />
              <label
                htmlFor="profile-img"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 32,
                  width: 32,
                  background: "white",
                  border: "1px solid  black",
                  borderRadius: "50%",
                  cursor: "pointer",
                  position: "absolute",
                  right: 6,
                  bottom: 6,
                }}
              >
                <LuCamera size={22} />
              </label>
              <Input
                id="profile-img"
                type="file"
                accept="image/*"
                sx={{ display: "none" }}
                onChange={(e) => handleImgUpdate(e.target.files[0])}
              />
            </Box>
            {error && (
              <Text color="red.500" fontSize="12px">
                {error}
              </Text>
            )}
            <Text fontWeight={500}>Email: {user?.email}</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
