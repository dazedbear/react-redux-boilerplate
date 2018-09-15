import { Machine } from "xstate";

// https://github.com/MicheleBertoli/react-automata/blob/master/FAQ.md
export default Machine({
  initial: "prelogin",
  states: {
    // 未登入
    prelogin: {
      on: {}
    },
    // 已登入
    login: {}
  }
});
