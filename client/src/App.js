import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Chats from "./pages/Chats";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/chats",
    element: <Chats />,
  },
]);

function App() {
  return <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />;
}

export default App;
