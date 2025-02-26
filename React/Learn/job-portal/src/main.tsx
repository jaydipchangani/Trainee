import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux"; // import Redux Provider
import store from "./redux/store"; // import Redux store
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
