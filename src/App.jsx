import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import Login from "./login";
// import Dashboard from "./dashboard";
import { useState } from "react";
import Api from "./api";

const App = () => {
  const state = useSelector((state) => state);
  // const dispatch = useDispatch();

  // const [page, setPage] = useState(<div>loading...</div>);
  // useEffect(() => {
  //   if (token) {
  //     setPage(<Dashboard />);
  //   } else {
  //     setPage(<Login />);
  //   }
  // }, [token]);

  // if (state.authenticated === false) {
  //   return <Navigate to="/login" />;
  // }

  return (
    <>
      {state.authenticated ? (
        <div>
          <Api />
          <Outlet />
        </div>
      ) : (
        <Login />
      )}
    </>
  );

  // return (
  //   <div>
  //     {page}
  //     <Api />
  //   </div>
  // );
};

export default App;
