import { NOT_FOUND } from 'redux-first-router';

export const routes = {
  HOME: '/',
  [NOT_FOUND]: '/404',
  COUNTRY: '/country/:iso/:category',
  WIDGET: '/widget/:iso/:widget_slug',
  RESOURCES: '/resources',
  INDICATORS: '/indicators',
};

export default routes;
