import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import BaseLayout from "./templates/BaseLayout";
import configureStore, { ShareStoreContext } from "./store";
import "antd/dist/antd.css";
import "antd-mobile/dist/antd-mobile.css";
import "./style.scss";

const App = () => (
  <Provider store={configureStore}>
    <ShareStoreContext.Provider value={configureStore}>
      <BrowserRouter>
        <BaseLayout />
      </BrowserRouter>
    </ShareStoreContext.Provider>
  </Provider>
);

ReactDOM.render(<App />, document.getElementById("root"));
export default App;
