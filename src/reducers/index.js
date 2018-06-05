//@flow
import { handleActions } from "redux-actions";
import moment from "moment";
import actions from "../actions";

import entities from "./entitiesReducer";

const { STATS_TYPES } = actions;
const [, STATS_SUCCESS] = STATS_TYPES;

const stats = handleActions({
  [STATS_SUCCESS]: (state, { response }) => (
    response.pesalinkCashouts || response.pesalinkCustomerCheck
  )
}, null);

export default {
  entities,
  stats
};
