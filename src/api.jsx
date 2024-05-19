import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

const server_url = "ws://localhost:8000";

const Api = () => {
  const ws = useRef(null);

  const state = useSelector((state) => state);
  const dispatch = useDispatch();

  const loadCredsFromLocalStorage = () => {
    let user_id = localStorage.getItem("user_id");
    let username = localStorage.getItem("username");
    let token = localStorage.getItem("token");
    // if (!ws.current) return;
    // if (ws.current.readyState !== 1) return;
    if (!user_id || !username || !token) {
      console.log(
        "something missing in localstorage",
        user_id,
        username,
        token
      );
      return;
    }
    dispatch({
      type: "loginWithToken",
      payload: {
        user_id,
        username,
        token,
      },
    });
  };

  useEffect(() => {
    ws.current = new WebSocket(server_url);
    ws.current.onopen = () => {
      console.log("connected");
      // load creds from localstorage
      loadCredsFromLocalStorage();
    };
    ws.current.onclose = () => {
      console.log("disconnected");
    };

    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      switch (data.action) {
        case "registerSuccess":
          console.log("registerSuccess");
          dispatch({
            type: "setAuth",
            payload: {
              user_id: data.user_id,
              username: data.username,
              token: data.token,
            },
          });
          break;
        case "auth":
          console.log("auth data", data);
          dispatch({
            type: "setAuth",
            payload: {
              user_id: data.user.user_id,
              username: data.user.username,
              token: data.user.token,
            },
          });
          break;
        case "buy":
          console.log("buy");
          break;
        case "sell":
          console.log("sell");
          break;
        default:
          console.log("default");
      }
    };

    return () => {
      ws.current.close();
    };
  }, []);

  useEffect(() => {
    if (!ws.current) return;
    if (state.wsMessage) {
      ws.current.send(state.wsMessage);
    }
  }, [state.wsMessage]);

  return <>{true}</>;
};

const buy = () => {
  return false;
};
const sell = () => {
  return false;
};

export default Api;
export { buy, sell };
