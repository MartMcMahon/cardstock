import { useState } from "react";
import { useDispatch } from "react-redux";

const Login = () => {
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const submit = (e) => {

    dispatch({ type: "auth", payload: { user_id: e, token: "token" } });
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={submit}>
        <input
          type="text"
          placeholder="username"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          value={username}
        />
        <input
          type="password"
          placeholder="password"
          onChange={(e) => {
            setPasswordInput(e.target.value);
          }}
          value={passwordInput}
        />
        <button action="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
