import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./authContext";
import routes from "./routes";
import store from "./store";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") || new HTMLElement()).render(
  <React.StrictMode>
    <AuthProvider>
      <Provider store={store}>
        <RouterProvider router={routes} />
      </Provider>
    </AuthProvider>
  </React.StrictMode>
);
document.title = 'Cardstock';
