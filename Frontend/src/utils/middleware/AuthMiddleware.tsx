import { Navigate, Outlet } from "react-router";
import { store } from "../store/store";

export const AuthMiddleware = () => {
  const token = store("token");
  try {
    if (!token) {
      return <Outlet />;
    } else {
      return <Navigate to={"/"} />;
    }
  } catch (error) {
    console.log("error");
    return <Navigate to={"/"} />;
  }
};
