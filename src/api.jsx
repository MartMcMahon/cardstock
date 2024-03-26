import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

const server_url = "ws://localhost:8000";

const Api = () => {
  const server_url = "ws://localhost:8000";
  const ws = useRef(null);

  const state = useSelector((state) => state);

  useEffect(() => {
    ws.current = new WebSocket(server_url);
    ws.current.onopen = () => {
      console.log("connected");
    };
    ws.current.onclose = () => {
      console.log("disconnected");
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
