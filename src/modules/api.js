import { RSAA } from "redux-api-middleware";
import { fromJS } from "immutable";
import uuid from "uuid/v4";

/**
 * Global Map
 */
let apiControllersMap = fromJS({});

/**
 * Action
 */
// 發送 API
// 可使用 requestAPI().then(({ requestId, actionRSAA }) => doSomething or cancelAPI(requestId)) 取得當前 requestId
export const REQUEST_API = "REQUEST_API";
export const RECIEVE_API = "RECIEVE_API";
export const FAILURE_API = "FAILURE_API";
export const requestAPI = (endpoint, options = {}, payload = {}, callback) => {
  const requestId = uuid();

  // 註冊取消 fetch 的控制開關
  const controller = new window.AbortController();
  apiControllersMap.set(requestId, controller);

  // 發送 API
  const actionRSAA = {
    [RSAA]: {
      endpoint: endpoint,
      types: [REQUEST_API, RECIEVE_API, FAILURE_API],
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      signal: controller.signal,
      body:
        options.method && options.method !== "GET"
          ? JSON.stringify(payload)
          : undefined,

      bailout: () => {},
      ...options
    }
  };
  return Promise.resolve({
    requestId,
    actionRSAA
  });
};

// 取消特定 API Request
export const CANCEL_API = "CANCEL_API";
export const cancelAPI = id => ({
  type: CANCEL_API,
  id
});

/**
 * Middleware
 */
// 轉換 promise && 取消特定 API request
export const apiCancellableMiddleware = ({ getState }) => next => action => {
  if (action.type === CANCEL_API) {
    const prevController = apiControllersMap.get(action.id);
    prevController && prevController.abort();
    apiControllersMap = apiControllersMap.delete(action.id);
    next(action);
  }
  if (action instanceof Promise) {
    // 後面由 redux-api-middleware 接手
    return action.then(({ requestId, actionRSAA }) => next(actionRSAA));
  }
  next(action);
};
