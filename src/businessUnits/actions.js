//@flow
import { actionsTemplate } from "../crud";
import { businessUnit } from "./schemas";

export default actionsTemplate("businessUnit", "/business_units", businessUnit, {
  queryCreator: ({ name }) => `?name=${name || ""}`
});
