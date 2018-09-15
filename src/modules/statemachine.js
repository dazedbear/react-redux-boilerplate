import { List, Map, Record, fromJS } from "immutable";

/**
 * Actions
 */
// component mount 時註冊新的狀態機
export const REGISTER_STATE_MACHINE = "REGISTER_STATE_MACHINE";
export const registerStateMachine = (key, machine, extendedState) => ({
  type: REGISTER_STATE_MACHINE,
  payload: {
    key,
    machine,
    extendedState
  }
});

// component unmount 時移除狀態機
export const REMOVE_STATE_MACHINE = "REMOVE_STATE_MACHINE";
export const removeStateMachine = (key, extendedState) => ({
  type: REMOVE_STATE_MACHINE,
  payload: {
    key,
    extendedState
  }
});

// 執行狀態切換
export const STATE_MACHINE_TRANSITION = "STATE_MACHINE_TRANSITION";
export const stateMachineTransition = (key, event, extendedState) => ({
  type: STATE_MACHINE_TRANSITION,
  payload: {
    key,
    event,
    extendedState
  }
});

/**
 * Reducer
 */
const createStatemachine = Record({
  value: "",
  machine: Map(),
  extendedState: Map()
});

export const statemachine = (state = Map(), action) => {
  if (!action.payload || !action.payload.key) {
    return state;
  }
  switch (action.type) {
    case REGISTER_STATE_MACHINE: {
      const { key, machine, extendedState } = action.payload;
      if (!action.payload.machine) return state;

      const value = machine.initialState.value;
      return state.set(
        key,
        createStatemachine({
          value,
          machine,
          extendedState: fromJS(extendedState || {})
        })
      );
    }

    case REMOVE_STATE_MACHINE: {
      const { key, extendedState } = action.payload;
      return state.delete(key);
    }

    case STATE_MACHINE_TRANSITION: {
      const { key, event, extendedState } = action.payload;
      const machine = state.getIn([key, "machine"]);
      if (!machine) return state;

      const newState = machine.transition(
        state.getIn([key, "value"]),
        event,
        extendedState
      ).value;
      return state
        .setIn([key, "value"], newState)
        .updateIn(
          [key, "extendedState"],
          prevExtendedState =>
            extendedState && typeof extendedState === "object"
              ? prevExtendedState.merge(extendedState)
              : prevExtendedState
        );
    }

    default:
      return state;
  }
};

/**
 * Middlewares
 */
export const statemachineMiddleware = store => next => action => {
  const state = store.getState();
  const validActions = List([
    REGISTER_STATE_MACHINE,
    REMOVE_STATE_MACHINE,
    STATE_MACHINE_TRANSITION
  ]);

  // send action first
  next(action);

  if (!validActions.includes(action.type)) return;

  const { key, event, extendedState } = action.payload;
  const machine =
    action.type === REGISTER_STATE_MACHINE
      ? action.payload.machine
      : state.getIn(["ui", "statemachine", key, "machine"]);
  const currentState =
    state.getIn(["ui", "statemachine", key, "value"]) ||
    machine.initialStateValue;

  // run onExist actions
  if (
    action.type === REMOVE_STATE_MACHINE ||
    action.type === STATE_MACHINE_TRANSITION
  ) {
    const currentMachine = machine.getStateNode(currentState);
    // currentMachine = StateNode, has onEntry, onExit
    currentMachine.onExit.forEach(action => {
      action.extendedState = extendedState;
      store.dispatch(action);
    });
  }

  // run onEntry actions
  if (action.type === REGISTER_STATE_MACHINE) {
    machine.initialState.actions.forEach(action => {
      action.extendedState = extendedState;
      store.dispatch(action);
    });
  }
  if (action.type === STATE_MACHINE_TRANSITION) {
    const currentState =
      state.getIn(["ui", "statemachine", key, "value"]) ||
      machine.initialStateValue;
    const nextMachine = machine.transition(
      currentState,
      event,
      extendedState,
      state
    );
    // nextMachine = State, has actions(onEntry) only
    nextMachine.actions.forEach(action => {
      action.extendedState = extendedState;
      store.dispatch(action);
    });
  }
};
