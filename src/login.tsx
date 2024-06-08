import { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "./hooks/useAuth";
import { auth } from "./firebase";
import "./login.css";

const Login = () => {
  const { currentUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [_loading, setLoading] = useState(true); // State to handle loading state

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

  return (
    <div className="container">
      <div className="login-form">
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
      </div>
    </div>
  );
};

export default Login;
