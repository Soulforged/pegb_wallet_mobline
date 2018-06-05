//@flow
import { schema } from "normalizr";

type Error = {
  status: number,
  description: string
};

export const error = (error: Error, status: number) => { //eslint-disable-line
  switch (status) {
  case 401: return { ...error, message: error.description };
  case 404: {
    return { ...error, message: error.description, expected: true };
  }
  default: {
    return { ...error, message: error.description };
  }
  }
};

export const list = (single: schema.Entity) => new schema.Entity(
  "results",
  { results: [single] },
  { idAttribute: () => single.key }
);
