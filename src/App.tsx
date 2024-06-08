import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { useAuth } from "./hooks/useAuth";
import "./App.css";

function App() {
  const { currentUser } = useAuth();
  const [_userData, setUserData] = useState<any>(null); // State to hold user data
  const [_loading, setLoading] = useState(true); // State to handle loading state

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) {
        window.location.href = "/login";
      }
      setLoading(false);
    };
    fetchUserData();
  }, [currentUser]);

  return <Outlet />;
}

export default App;
