import { takeEvery, take, select, put } from "redux-saga/effects";
import { delay } from "redux-sage";
import stateMachines from "../statecharts";

/**
 * Actions
 */
export const SIGN_IN = "SIGN_IN";
export const signIn = () => ({
  type: SIGN_IN
});

export const SIGN_OUT = "SIGN_OUT";
export const signOut = () => ({
  type: SIGN_OUT
});

export const SIGN_UP = "SIGN_UP";
export const signUp = () => ({
  type: SIGN_UP
});

/**
 * Common Sagas
 */
export function* signInProcess() {
  console.log(stateMachines);
  yield takeEvery(SIGN_IN, function*(action) {
    console.log("signIn", action);
    yield put({ type: "SIGN_IN_SUCCESS" });
  });
}

export function* loginFilter() {}

/**
 * Flow Sagas
 */
