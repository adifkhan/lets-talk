import React from "react";
import { axios } from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
} from "@chakra-ui/react";
import { GlobalState } from "../../context/chatContext";

const Login = () => {
  const navigate = useNavigate();
  const { setAuth } = GlobalState();
  const [loading, setLoading] = React.useState(false);
  const [showPass, setShowPass] = React.useState(false);
  const [error, setError] = React.useState("");
  const [userData, setUserData] = React.useState({
    email: "",
    password: "",
  });
  const login = async () => {
    setLoading(true);
    if (!userData.email || !userData.password) {
      setError("Please provide all required fields");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post("/auth/login", userData);

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
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Your Email"
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={showPass ? "text" : "password"}
            placeholder="Enter Your Password"
            value={userData.password}
            required
            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
          />
          <InputRightElement width={"4.5rem"}>
            <Button h="1.75rem" size={"sm"} onClick={() => setShowPass(!showPass)}>
              {showPass ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Text color={"red"} fontSize={"14px"}>
        {error}
      </Text>
      <Button
        w={"100%"}
        colorScheme="teal"
        textTransform={"uppercase"}
        mt={5}
        onClick={login}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
        w={"100%"}
        colorScheme="green"
        textTransform={"uppercase"}
        mt={1}
        onClick={() => setUserData({ email: "guest@example.com", password: "123456" })}
        isLoading={loading}
      >
        Login as guest
      </Button>
    </VStack>
  );
};

export default Login;
