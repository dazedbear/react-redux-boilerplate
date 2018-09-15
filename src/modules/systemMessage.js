import uuid from "uuid/v4";
import { fromJS } from "immutable";

/**
 * Action
 */
export const PUSH_SYS_MESSAGE = "PUSH_SYS_MESSAGE";
export const pushSystemMessage = (content = "", level = "info") => ({
  type: PUSH_SYS_MESSAGE,
  payload: {
    content,
    level,
    id: uuid()
  }
});

export const DEL_SYS_MESSAGE = "DEL_SYS_MESSAGE";
export const delSystemMessage = id => ({
  type: DEL_SYS_MESSAGE,
  id
});

/**
 * Reducer
 */
export const systemMessage = (state = fromJS([]), action) => {
  switch (action.type) {
    case PUSH_SYS_MESSAGE: {
      return state.push(fromJS(action.payload));
    }
    case DEL_SYS_MESSAGE: {
      return state.filter(message => message.get("id") !== action.id);
    }
    default:
      return state;
  }
};

/**
 * Middleware
 */
export const systemMessageMiddleware = store => next => action => {
  const validLevels = fromJS(["info", "loading", "success", "error"]);

  if (
    action.type === PUSH_SYS_MESSAGE &&
    !validLevels.includes(action.payload.level)
  ) {
    console.error(
      "Invalid system message level. Accept info, success, error, loading.",
      action.payload.level
    );
    return;
  }
  return next(action);
};
