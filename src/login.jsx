import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { registerAction } from "./store";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import "./login.css";

const Login = () => {
  const auth = getAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLogingIn, setIsLogingIn] = useState(true);
  const [username, setUsername] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  const submit = () => {
    //login
    // e.preventDefault();
    // dispatch({ type: "loginWithCreds", payload: { usernameInput: username, passwordInput } });
  };

  const signUpSubmit = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, newEmail, newPassword1)
      .then((userCredential) => {
        const user = userCredential.user;
        dispatch({
          type: "firebaseRegisterUser",
          payload: { firebase_user_access_token: user.accessToken, email: newEmail },
        });
      navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("error", errorCode, errorMessage);
      });

    // e.preventDefault();
    // dispatch(
    //   registerAction({ action: "registerNewUser", user_id: newUsername, username: newUsername, passHash: newPassword1 })
    // );
  };

  return (
    <div>
      {isLogingIn ? (
        <>
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
          <div
            className="sign-up"
            onClick={() => {
              setIsLogingIn(false);
              setUsername(username);
            }}
          >
            Sign Up
          </div>
        </>
      ) : (
        <>
          <h1>New User</h1>
          <form onSubmit={signUpSubmit}>
            <input
              type="text"
              placeholder="email"
              onChange={(e) => {
                setNewEmail(e.target.value);
              }}
              value={newEmail}
            />
            <input
              type="password"
              placeholder="password"
              onChange={(e) => {
                setNewPassword1(e.target.value);
              }}
              value={newPassword1}
            />
            <input
              type="password"
              placeholder="verify password"
              onChange={(e) => {
                setNewPassword2(e.target.value);
              }}
              value={newPassword2}
            />
            <button action="submit">Sign Up</button>
          </form>
        </>
      )}
    </div>
  );
};

export default Login;
