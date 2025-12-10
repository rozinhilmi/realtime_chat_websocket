import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router";
import { Dashboard, RoomChat } from "./pages";
import { AuthMiddleware } from "./utils/middleware/AuthMiddleware";
import { Login } from "./pages/Auth/login";
import { Middleware } from "./utils/middleware/Middleware";
import { Layout } from "./pages/Layout";

export const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Middleware />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="room-chat/:roomId" element={<RoomChat />} />
          </Route>
        </Route>
        <Route path="auth" element={<AuthMiddleware />}>
          <Route path="login" element={<Login />} />
        </Route>
      </>
    )
  );
  return <RouterProvider router={router} />;
};
