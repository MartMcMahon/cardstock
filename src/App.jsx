import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Outlet } from "react-router-dom";
import Api from "./api";

import { firebaseConfig } from "./firebaseConfig.jsx";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebase_app = initializeApp(firebaseConfig);
const auth = getAuth();
auth.languageCode = "it";

const App = () => {
  const { authenticated } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (authenticated) {
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [authenticated]);

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
      <Api />
      {/* {state.authenticated ? ( */}
      <div>
        <Outlet />
      </div>
      {/* ) : ( */}
      {/*   <Login /> */}
      {/* {/1* )} *1/} */}
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
