//@flow
import { normalize } from "normalizr";
import { camelizeKeys } from "humps";
import { CALL_API } from "../../constants";
import actions from "../../actions";

type Config = {
  root: string
};

const { logout } = actions;

const isJson = (resp) => {
  const type = resp.headers.get("content-type");
  return type && type.indexOf("application/json") !== -1;
};

const jsonOrText = resp => (isJson(resp) ? resp.json() : resp.text());

const method = ({ remove, update, body }) => {
  if (remove) {
    return "DELETE";
  }
  if (body) {
    return update ? "PUT" : "POST";
  }
  return "GET";
};

const callApi = (endpoint, dispatch, optParams) => {
  const {
    schema,
    body,
    errorSchema
  } = optParams;
  const options = {
    credentials: "include",
    body: body && JSON.stringify(body),
    method: method(optParams),
    cache: "no-cache",
    headers: {
      accept: "application/json",
      "content-type": body ? "application/json" : "text/plain"
    }
  };
  const error = (originalError, { status }) => {
    if (errorSchema) {
      return errorSchema(originalError, status);
    }
    return originalError;
  };
  const checkStatus = (response) => {
    if (!response.ok) {
      if (response.status === 401) {
        dispatch(logout());
      }
      return jsonOrText(response)
        .then(originalError => error(originalError, response))
        .then(e => Promise.reject(e));
    }
    return jsonOrText(response);
  };
  const doNormalize = json => (
    schema ? normalize(camelizeKeys(json), schema) : camelizeKeys(json)
  );

  return fetch(endpoint, options)
    .then(checkStatus)
    .then(doNormalize)
    .catch(err => Promise.reject(err));
};

const shouldUseCache = (store, key, invalidatesCache) => (
  !invalidatesCache && key && store.getState().entities
      && store.getState().entities[key]
      && store.getState().entities[key].valid
);

export default (config: Config) => (
  (store) => (next) => (action: Object) => {
    const callAPI = action[CALL_API];
    if (!callAPI) {
      return next(action);
    }

    const { endpoint } = callAPI; // eslint-disable-line immutable/no-let
    const {
      types,
      key,
      after,
      invalidatesCache
    } = callAPI;

    if (shouldUseCache(store, key, invalidatesCache)) {
      return next({ type: "CALL_API_FROM_CACHE" });
    }

    if (typeof endpoint !== "string") {
      throw new Error("'endpoint' should be a URL string.");
    }

    if (!Array.isArray(types) || types.length !== 3) {
      throw new Error("Expected an array of three action types.");
    }

    if (!types.every(type => typeof type === "string")) {
      throw new Error("Expected action types to be strings.");
    }

    const actionWith = (data) => {
      const key1 = key ? { key } : {};
      const finalAction = { ...action, ...data, ...key1 };
      delete finalAction[CALL_API];
      return finalAction;
    };

    const [requestType, successType, failureType] = types;
    next(actionWith({ type: requestType }));

    return (callApi(config.root + endpoint, next, callAPI).then(
      (response: Object) => {
        const n = next(actionWith({ response, type: successType }));
        if (after){
          return after(store.dispatch, response);
        }
        return n;
      },
      (error: Object) => next(actionWith({
        type: failureType,
        error: error || new Error("Unexpected error")
      }))
    ): Object);
  }
);
