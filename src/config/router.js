import { NOT_FOUND } from 'redux-first-router';

export const routes = {
  HOME: '/',
  [NOT_FOUND]: '/404',
  COUNTRY: '/:iso',
  WIDGET: '/widget/:widget_slug',
};

export default routes;