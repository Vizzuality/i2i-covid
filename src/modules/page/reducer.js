import { NOT_FOUND } from 'redux-first-router';

const pageComponentsNames = {
  HOME: 'Home',
  COUNTRY: 'Country',
  WIDGET: 'Widget',
  [NOT_FOUND]: 'NotFound',
  RESOURCES: 'Resources',
};

export default (state = 'HOME', action = {}) => pageComponentsNames[action.type] || state;
