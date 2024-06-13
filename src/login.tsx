import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./firebase";
import { createUserData, getUserData } from "./user";
import { Dispatch } from "./store";
import "./login.css";

const Login = () => {
  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordInput1, setPasswordInput1] = useState("");
  const [passwordInput2, setPasswordInput2] = useState("");
  const [isLoginPanel, setIsLoginPanel] = useState(true);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User signed in: ", userCredential.user);
      dispatch(getUserData(userCredential.user.uid));
      navigate("/");
    } catch (error) {
      console.error("Error signing in: ", error);
    }
  };

  const handleRegister = async () => {
    console.log("handleRegister");
    if (passwordInput1 !== passwordInput2) {
      console.error("Passwords do not match");
      return;
    }
    createUserWithEmailAndPassword(auth, email, passwordInput1)
      .then((res): any => {
        dispatch(createUserData(res.user.uid, res.user.email || ""));
        navigate("/");
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.error("Error creating user: ", errorMessage);
      });
  };

  return (
    <div className="container">
      <div className="login-header">
        <div
          className={"login-title" + (isLoginPanel ? " active" : "")}
          onClick={() => {
            setIsLoginPanel(true);
          }}
        >
          Login
        </div>
        <div
          className={"signup-title" + (!isLoginPanel ? " active" : "")}
          onClick={() => {
            setIsLoginPanel(false);
          }}
        >
          Register
        </div>
      </div>
      <div className={"login-form" + (isLoginPanel ? "" : " register")}>
        {isLoginPanel ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button>Login</button>
          </form>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRegister();
            }}
          >
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={passwordInput1}
              onChange={(e) => setPasswordInput1(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={passwordInput2}
              onChange={(e) => setPasswordInput2(e.target.value)}
            />
            <button>Sign Up</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
