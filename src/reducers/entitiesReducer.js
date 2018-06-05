//@flow
import { merge } from "lodash";
import actions from "../actions";

type State = {
  users: Object
};

type EntityResponse = {
  id?: string | number,
  error?: Object,
  result: Object,
  entities?: Object,
};

type EntityAction = {
  type: string,
  key: string,
  response: EntityResponse,
  error?: boolean,
  payload?: Object
};

const {
  ENTITIES, SAVE, DELETE, FAIL, REQ, invalidateCache
} = actions;

const initialState: State = {
  users: { ids: [], byId: {} },
  roles: { ids: [], byId: {} },
  businessUnits: { ids: [], byId: {} }
};

const entitiesRegex = new RegExp(`^${ENTITIES}/([\\w_]+)_.*$`);
const failureRegex = new RegExp(`/[\\w_]+_${FAIL}$`);
const requestRegex = new RegExp(`/[\\w_]+_${REQ}$`);
const saveRegex = new RegExp(`/${SAVE}_[\\w_]+`);
const deleteRegex = new RegExp(`/${DELETE}_[\\w_]+`);

const getIds = ({ entities, result }, key) => (
  entities && entities.results ? entities.results[key].results : result
);

const handleFetch = (action: EntityAction, entityName, state) => {
  if (requestRegex.test(action.type)){
    return {
      ...state,
      [entityName]: {
        ...state[entityName],
        fetching: true
      }
    };
  }
  if (failureRegex.test(action.type)){
    return {
      ...state,
      [entityName]: {
        ...state[entityName],
        fetching: false,
        error: action.error
      }
    };
  }
  const { entities } = action.response;
  const byId = entities ? entities[entityName] : {};
  const ids1 = getIds(action.response, entityName);
  const ids = ids1 && !(ids1 instanceof Array) ? [ids1] : ids1;
  const newState = { [entityName]: { byId, ids, fetching: false } };
  const merged = merge({}, state, newState);
  const merged1 = {
    ...merged,
    [entityName]: {
      ...merged[entityName],
      lastResultIds: ids,
      error: false,
      valid: true
    }
  };
  return merged1;
};

const handleSaveOrDelete = (action, entityName, state) => {
  if (requestRegex.test(action.type)){
    return {
      ...state,
      [entityName]: {
        ...state[entityName],
        saving: true
      }
    };
  }
  if (failureRegex.test(action.type)){
    return {
      ...state,
      [entityName]: {
        ...state[entityName],
        saving: false,
        saveError: action.error
      }
    };
  }
  const { id } = action.response;
  return {
    ...state,
    [entityName]: {
      ...state[entityName],
      savedId: id,
      saveError: false,
      saving: false,
      valid: false
    }
  };
};

export default (state: State = initialState, action: EntityAction) => {
  if (invalidateCache().type === action.type) {
    const { keys } = action.payload ? action.payload : {};
    const keysToUse = keys ? keys.filter(key => state[key] !== undefined) : Object.keys(state);
    return keysToUse.reduce(
      (acc, key) => ({ ...acc, [key]: { ...acc[key], valid: false } }),
      state
    );
  }
  if (entitiesRegex.test(action.type)) {
    const entityName = action.key;

    if (deleteRegex.test(action.type) || saveRegex.test(action.type)) {
      return handleSaveOrDelete(action, entityName, state);
    }

    return handleFetch(action, entityName, state);
  }

  return state;
};
