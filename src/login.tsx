import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useAuth } from "./hooks/useAuth";
import { auth } from "./firebase";
import "./login.css";

const Login = () => {
  const { currentUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordInput1, setPasswordInput1] = useState("");
  const [passwordInput2, setPasswordInput2] = useState("");
  const [_loading, setLoading] = useState(true);

  const [isLoginPanel, setIsLoginPanel] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        window.location.href = "/";
      }
      setLoading(false);
    };
    fetchUserData();
  }, [currentUser]);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User signed in: ", userCredential.user);
    } catch (error) {
      console.error("Error signing in: ", error);
    }
  };

  const handleRegister = async () => {
    if (passwordInput1 !== passwordInput2) {
      console.error("Passwords do not match");
      return;
    }
    console.log("Registering with email: ", email, passwordInput1);
    createUserWithEmailAndPassword(auth, email, passwordInput1)
      .then((_userCredential) => {
        // Signed up
        // const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // ..
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
            <button onClick={handleLogin}>Login</button>
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
            <button onClick={handleRegister}>Sign Up</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
