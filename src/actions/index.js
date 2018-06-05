//@flow
import { createActions } from "redux-actions";
import { CALL_API } from "../constants";
import type { UserInfo, AppError, ResetInfo } from "src/types";

const ENTITIES = "@@entities";
const SAVE = "SAVE";
const REQ = "REQUEST";
const SUCCESS = "SUCCESS";
const FAIL = "FAILURE";
const DELETE = "DEL";

const sleep = (timeout = 500) => new Promise(resolve => setTimeout(resolve, timeout));

async function delay(func, by) {
  await sleep(by);
  return func();
}

const saveTypes = (actionName) => {
  const normActionName = actionName.toUpperCase();
  return [
    `${ENTITIES}/${SAVE}_${normActionName}_${REQ}`,
    `${ENTITIES}/${SAVE}_${normActionName}_${SUCCESS}`,
    `${ENTITIES}/${SAVE}_${normActionName}_${FAIL}`
  ];
};

const deleteTypes = (actionName) => {
  const normActionName = actionName.toUpperCase();
  return [
    `${ENTITIES}/${DELETE}_${normActionName}_${REQ}`,
    `${ENTITIES}/${DELETE}_${normActionName}_${SUCCESS}`,
    `${ENTITIES}/${DELETE}_${normActionName}_${FAIL}`
  ];
};

const fetchTypes = actionName => [
  `${actionName}_${REQ}`,
  `${actionName}_${SUCCESS}`,
  `${actionName}_${FAIL}`
];

const fetchEntitiesTypes = actionName => fetchTypes(`${ENTITIES}/${actionName.toUpperCase()}`);

const LOGIN_TYPES = fetchTypes("LOGIN");

const login = ({ username, password, captcha }: UserInfo) => ({
  [CALL_API]: {
    types: LOGIN_TYPES,
    endpoint: "/authenticate/generate-token",
    body: { user: username, password, captcha }
  }
});

const VALIDATE_TOKEN_TYPES = fetchTypes("VALIDATE_TOKEN");

const validateToken = (token: string) => ({
  [CALL_API]: {
    types: VALIDATE_TOKEN_TYPES,
    endpoint: "/authenticate/validate-token",
    body: { token }
  }
});

const STATUS_TYPES = fetchTypes("STATUS");

const status = () => ({
  [CALL_API]: {
    types: STATUS_TYPES,
    endpoint: "/status"
  }
});

const RESET_TYPES = fetchTypes("RESET");

const reset = ({ username, email }: ResetInfo) => ({
  [CALL_API]: {
    types: RESET_TYPES,
    endpoint: "/authenticate/generate-update-password",
    body: { user: username, email }
  }
});

const STATS_TYPES = fetchTypes("STATS");

const fetchStats = () => ({
  [CALL_API]: {
    types: STATS_TYPES,
    endpoint: "/stats",
    after: dispatch => delay(() => dispatch(fetchStats()), 2000)
  }
});

const syncActions = createActions({
  SET_ERROR: (error: AppError) => error,
  LOGOUT: () => ({}),
  TOGGLE_THEME: () => ({}),
  TOGGLE_MENU: () => ({}),
  TOGGLE_USER_MENU: () => ({}),
  SET_CAPTCHA_REQUIRED: isRequired => isRequired,
  INVALIDATE_CACHE: keys => ({ keys })
});

export default {
  ENTITIES,
  SAVE,
  DELETE,
  REQ,
  SUCCESS,
  FAIL,
  saveTypes,
  fetchTypes,
  fetchEntitiesTypes,
  deleteTypes,
  login,
  validateToken,
  status,
  reset,
  fetchStats,
  LOGIN_TYPES,
  VALIDATE_TOKEN_TYPES,
  STATUS_TYPES,
  RESET_TYPES,
  STATS_TYPES,
  ...syncActions
};
