import React from "react";
import createSagaMiddleware from "redux-saga";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import { apiMiddleware } from "redux-api-middleware";
import { apiCancellableMiddleware } from "./modules/api";
import { processMiddleware } from "./modules/process";
import { systemMessageMiddleware } from "./modules/systemMessage";
import { rootReducer, rootSaga } from "./modules";

const sagaMiddleware = createSagaMiddleware();
const configureStore = createStore(
  rootReducer,
  composeWithDevTools({
    maxAge: 100,
    actionsBlacklist: []
  })(
    applyMiddleware(
      apiCancellableMiddleware,
      systemMessageMiddleware,
      processMiddleware,
      sagaMiddleware,
      apiMiddleware
    )
  )
);

sagaMiddleware.run(rootSaga);

export default configureStore;
export const ShareStoreContext = React.createContext();
