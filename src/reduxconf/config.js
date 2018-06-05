//@flow
import { combineReducers, createStore, applyMiddleware } from "redux";
import reducers from "./reducerConfig";
import middlewares from "./middlewaresConfig";

export default (config: Object = {}) => {
  const rootReducer = combineReducers(reducers);
  const mdws = middlewares(config);

  return createStore(rootReducer, applyMiddleware(...mdws));
};
