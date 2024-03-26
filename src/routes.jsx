import { createBrowserRouter } from "react-router-dom";
import App from "./app.jsx";
import Login from "./login";
import Dashboard from "./components/dashboard";
import Portfolio from "./components/portfolio";
import Cards from "./components/cards";
import Card from "./components/card";
import About from "./components/about";

import "./index.css";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Dashboard /> },
      {
        path: "/portfolio",
        element: <Portfolio />,
      },
      {
        path: "/cards",
        element: <Cards />,
      },
      {
        path: "/card/:id",
        element: <Card />,
      },
      {
        path: "/about",
        element: <About />,
      },
    ],
  },
  { path: "/login", element: <Login /> },
]);

export default routes;
