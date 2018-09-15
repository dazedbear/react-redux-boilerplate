import { requestAPI } from "./api";
import config from "../config";

// CRUD: create, fetch, update, delete, naming 隨意易分辨就好
class Service {
  static account = {
    fetchStatus: ({ uid }) => requestAPI(`${config.api}/user/${uid}/status`),
    fetchInfo: ({ uid }) => requestAPI(`${config.api}/user/${uid}/`),
    signUp: body =>
      requestAPI(`${config.api}/user/signup`, { method: "post" }, body)
  };
  static profile = {};
  static monitor = {
    log: () => requestAPI(`${config.api}/log`, { method: "post" }),
    sigt: () => requestAPI(`${config.api}/sigt`),
    sendErrorReport: report =>
      requestAPI(`${config.api}/error`, { method: "post" }, report)
  };
}

export default Service;
