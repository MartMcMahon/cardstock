import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import AuthGate from "./authGate";
import Dashboard from "./dashboard";
import Login from "./login";
// import Portfolio from "./components/portfolio";
// import Cards from "./components/cards";
import Card from "./card";
// import About from "./components/about";

import "./index.css";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <AuthGate />,
        children: [
          {
            path: "/",
            element: <Dashboard />,
          },
          {
            path: "/card/:id",
            element: <Card />,
          },
        ],
      },
    ],
  },
  { path: "/login", element: <Login /> },
]);

export default routes;
