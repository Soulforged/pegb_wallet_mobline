//@flow
import thunkMiddleware from "redux-thunk";
import apiFactory from "./middlewares/apiFactory";

export default ({
  logActions = true,
  history,
  apiUrl
}: Object = {}) => {
  //FIXME this should also be an api call
  const apiAdapter = apiFactory({ root: "http://192.168.1.102:5001" });
  const mdws = [thunkMiddleware, apiAdapter];
  if (logActions) {
    const { logger } = require("redux-logger"); // eslint-disable-line global-require

    return [...mdws, logger];
  }
  return mdws;
};
