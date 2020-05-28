import React from 'react';
import PropTypes from 'prop-types';

import Home from 'pages/home';
import Country from 'pages/country';
import Widget from 'pages/widget';
import NotFound from 'pages/not-found';
import Resources from 'pages/resources';
import Indicators from 'pages/indicators';

const PagesComponents = { Home, Country, Widget, Resources, Indicators, NotFound };

const Pages = ({ page }) => {
  const Page = PagesComponents[page];

  return <Page />;
};

Pages.propTypes = {
  page: PropTypes.string.isRequired,
};

export default Pages;
