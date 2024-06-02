import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router";
import { Dispatch } from "./store";
import { useSelect } from "./hooks/useSelect";
import "./App.css";

function App() {
  const { token } = useSelect((state) => state.api);
  const dispatch = useDispatch<Dispatch>();

  useEffect(() => {
    if (token) {
      return;
    }
    if (localStorage.getItem("token")) {
      const token = localStorage.getItem("token");
      dispatch({ type: "loginWithToken", payload: token });
    } else {
      window.location.href = "/login";
    }
  }, [dispatch, token]);

  return <Outlet />;
}

export default App;
