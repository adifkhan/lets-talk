import { createContext, useContext, useEffect, useState } from "react";
import { axios } from "../utils/axios";

export const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [currentChat, setCurrentChat] = useState();
  const [refetch, setRefetch] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // set auth
  useEffect(() => {
    const getAuth = async () => {
      try {
        const res = await axios.get("/user/auth");
        setAuth(res?.data);
      } catch (error) {
        setAuth(null);
        console.error(error.response.data);
      }
    };
    getAuth();
  }, []);

  // get notifications
  useEffect(() => {
    const getNotifications = async () => {
      const res = await axios.get("/notification");
      setNotifications(res?.data);
    };
    auth?._id && getNotifications();
  }, [auth?._id, refetch]);

  // get current chat from local storage
  useEffect(() => {
    setCurrentChat(JSON.parse(localStorage.getItem("currentChat")));
  }, []);

  // set current chat to local storage
  useEffect(() => {
    localStorage.setItem("currentChat", JSON.stringify(currentChat));
  }, [currentChat]);

  return (
    <ChatContext.Provider
      value={{
        auth,
        setAuth,
        currentChat,
        setCurrentChat,
        refetch,
        setRefetch,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const GlobalState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
