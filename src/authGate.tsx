import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { getUserData } from "./user";
import { Dispatch } from "./store";
const AuthGate = () => {
  const { currentUser } = useAuth();
  const dispatch = useDispatch<Dispatch>();

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser && currentUser.uid) {
        dispatch(getUserData(currentUser.uid));
      }
    };
    fetchUserData();
  }, [currentUser, dispatch]);

  return currentUser ? <Outlet /> : <Navigate to="/login" />;
};
export default AuthGate;
