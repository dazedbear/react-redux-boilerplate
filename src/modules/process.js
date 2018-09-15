// 其他作法參考
// https://medium.com/stashaway-engineering/react-redux-tips-better-way-to-handle-loading-flags-in-your-reducers-afda42a804c6

import { fromJS } from "immutable";
import { REQUEST_API, API_SUCCESS, API_ERROR, CANCEL_API } from "./api";
import uuid from "uuid/v4";

/**
 * Action
 */
export const REGISTER_PROCESS = "REGISTER_PROCESS";
export const registerProcess = (id = uuid(), field = "global") => ({
  type: REGISTER_PROCESS,
  field,
  id
});

export const PROCESS_DONE = "PROCESS_DONE";
export const processDone = (id = uuid(), field = "global") => ({
  type: PROCESS_DONE,
  field,
  id
});

/**
 * Reducer
 */
const initState = fromJS({
  execute: [], // 正在處理中的 process
  done: [] // 完成處理的 process
});

export const process = (state = initState, action) => {
  switch (action.type) {
    case REGISTER_PROCESS: {
      const { field, id } = action;
      return state.updateIn(["execute"], list =>
        list
          .filter(
            process =>
              process.get("field") !== field && process.get("id") !== id
          )
          .push(fromJS({ field, id }))
      );
    }

    case PROCESS_DONE: {
      const { field, id } = action;
      const prevIndex = state
        .get("execute")
        .findKey(
          (process, index) =>
            process.get("field") === field && process.get("id") === id
        );

      if (!prevIndex) return state;
      return state
        .updateIn(["execute"], list => list.delete(prevIndex))
        .updateIn(["done"], list => list.push(fromJS({ field, id })));
    }

    default:
      return state;
  }
};

/**
 * Selector
 */
// execute 執行中, done 已完成, none 找不到
export const getProcessStatus = (process, id, field) => {
  const prevExecuteIndex = process
    .get("execute")
    .findKey(
      (process, index) =>
        process.get("field") === field && process.get("id") === id
    );
  const prevDoneIndex = process
    .get("done")
    .findKey(
      (process, index) =>
        process.get("field") === field && process.get("id") === id
    );

  if (prevExecuteIndex) return "execute";
  if (prevDoneIndex) return "done";
  return "none";
};

/**
 * Middleware
 */
export const processMiddleware = ({ getState }) => next => action => {
  // TODO: saga 流程被呼叫時自動處理 process
  const startProcessActions = fromJS([REQUEST_API]);
  const endProcessActions = fromJS([API_SUCCESS, API_ERROR, CANCEL_API]);
  if (startProcessActions.includes(action.type)) {
    return next(registerProcess(action.type));
  }
  if (endProcessActions.includes(action.type)) {
    return next(processDone(action.type));
  }
  return next(action);
};
