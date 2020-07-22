import "core-js/stable";
import "regenerator-runtime/runtime";
import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import { Provider } from 'react-redux';
import configureStore from './config/store';
import Pages from './pages';

import 'styles/index.scss';

ReactGA.initialize(`${process.env.REACT_APP_GOOGLE_ANALYTICS_TOKEN}`, {
  debug: process.env.NODE_ENV !== 'production',
});

const { store } = configureStore();

const App = () => (
  <Provider store={store}>
    <Pages className="l-pages" />
  </Provider>
);

ReactDOM.render(<App />, document.getElementById('root'));
