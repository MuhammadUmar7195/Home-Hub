import { StrictMode } from "react";
import App from "./App.jsx";
import { store } from "./store/store.redux.js";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
