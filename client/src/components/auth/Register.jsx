import React from "react";
import imageUploader from "../../utils/imgUploader";
import { axios } from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Text,
} from "@chakra-ui/react";
import { GlobalState } from "../../context/chatContext";

const Register = () => {
  const navigate = useNavigate();
  const { setAuth } = GlobalState();
  const [loading, setLoading] = React.useState(false);
  const [showPass, setShowPass] = React.useState(false);
  const [confirmPass, setConfirmPass] = React.useState(null);
  const [imgData, setImgData] = React.useState(null);
  const [error, setError] = React.useState("");
  const [userData, setUserData] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const register = async () => {
    setLoading(true);
    if (!userData.name || !userData.email || !userData.password) {
      setError("Please provide all required fields");
      setLoading(false);
      return;
    }
    if (!confirmPass || confirmPass !== userData.password) {
      setError("Passwords did not match");
      setLoading(false);
      return;
    }
    let imgUrl;
    if (imgData) {
      imgUrl = await imageUploader(imgData);
    }
    try {
      const { data } = await axios.post("/auth/register", { ...userData, profilePic: imgUrl });

      setAuth(data);
      setError("");
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      setError(error?.response?.data?.message);
      // console.log(error);
      setLoading(false);
    }
  };
  return (
    <VStack>
      <FormControl id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setUserData({ ...userData, name: e.target.value })}
        />
      </FormControl>
      <FormControl id="reg-email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Your Email"
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
        />
      </FormControl>
      <FormControl id="reg-password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={showPass ? "text" : "password"}
            placeholder="Enter Your Password"
            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
          />
          <InputRightElement width={"4.5rem"}>
            <Button h="1.75rem" size={"sm"} onClick={() => setShowPass(!showPass)}>
              {showPass ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confirmPass" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={showPass ? "text" : "password"}
            placeholder="Confirm Your Password"
            onChange={(e) => setConfirmPass(e.target.value)}
          />
          <InputRightElement width={"4.5rem"}>
            <Button h="1.75rem" size={"sm"} onClick={() => setShowPass(!showPass)}>
              {showPass ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="profilePic">
        <FormLabel>Profile Picture (optional)</FormLabel>
        <Input
          type="file"
          accept="image/*"
          p={1.5}
          onChange={(e) => setImgData(e.target.files[0])}
        />
      </FormControl>
      <Text color={"red"} fontSize={"14px"}>
        {error}
      </Text>
      <Button
        w={"100%"}
        colorScheme="teal"
        textTransform={"uppercase"}
        mt={5}
        onClick={register}
        isLoading={loading}
      >
        Register
      </Button>
    </VStack>
  );
};

export default Register;
