import { Outlet } from "react-router";
import { store } from "../store/store";
import { helper } from "../helper";

export const Middleware = () => {
  const token = store("token");
  try {
    if (token) {
      return <Outlet />;
    } else {
      helper.logout();
    }
  } catch (error) {
    helper.logout();
  }
};
