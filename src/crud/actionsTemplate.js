//@flow
import { list, error } from "../schemas";
import { CALL_API } from "../constants";
import actions from "../actions";

const { fetchEntitiesTypes, saveTypes, deleteTypes } = actions;
const restPath = body => (body.id ? `/${body.id}` : "");

type Options = {
  queryCreator?: (Object) => string,
  baseQuery?: () => string,
  filterSchema?: Object
};

export default (entityName: string, basePath: string, schema: Object, {
  queryCreator, baseQuery, filterSchema
}: Options = {}) => {
  const key = `${entityName}s`;
  const allQuery = baseQuery ? baseQuery() : "";
  const fetchAll = (opts?: Options) => ({
    [CALL_API]: {
      types: fetchEntitiesTypes(key),
      endpoint: `${basePath}${allQuery}`,
      schema: list(schema),
      errorSchema: error,
      key,
      ...opts
    }
  });
  return {
    save: (body: Object) => ({
      [CALL_API]: {
        types: saveTypes(entityName),
        endpoint: `${basePath}${restPath(body)}`,
        body,
        update: body.id != null,
        key,
        errorSchema: error,
        invalidatesCache: true
      }
    }),
    fetchOne: (id: number) => ({
      [CALL_API]: {
        types: fetchEntitiesTypes(entityName),
        endpoint: `${basePath}/${id}`,
        schema,
        errorSchema: error,
        key
      }
    }),
    remove: (id: number) => ({
      [CALL_API]: {
        types: deleteTypes(entityName),
        endpoint: `${basePath}/${id}`,
        remove: true,
        errorSchema: error,
        key,
        invalidatesCache: true
      }
    }),
    fetchAll,
    filter: (params: Object) => {
      if (!params) {
        return fetchAll({ invalidatesCache: true });
      }
      const query = queryCreator ? queryCreator(params) : "";
      return {
        [CALL_API]: {
          types: fetchEntitiesTypes(`${key}_FILTER`),
          endpoint: `${basePath}${query}`,
          schema: filterSchema || list(schema),
          errorSchema: error,
          key,
          invalidatesCache: true
        }
      };
    }
  };
};
