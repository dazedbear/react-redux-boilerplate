import { combineReducers } from "redux-immutable";
import { all } from "redux-saga/effects";
import { systemMessage } from "./systemMessage";
import { process } from "./process";
import { statemachine } from "./statemachine";

export function* rootSaga() {
  yield all([]);
}

export const rootReducer = combineReducers({
  systemMessage,
  process,
  statemachine
});
