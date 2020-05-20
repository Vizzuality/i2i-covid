import React from 'react';
import PropTypes from 'prop-types';

import Header from 'components/header';
import Hero from 'components/hero';
import Footer from 'components/footer';

const ToplineIndicators = ({ page }) => (
  <div className="l-indicators">
    <Header />
    <Hero page={page} />
    <div className="indicators-content">
      <div className="container indicators-content-decoration" />
      <div className="container">
        <div className="row">
          <div className="col">
            <iframe
              title="Topline indicators content"
              src="/indicators.html"
              frameBorder="0"
              width="100%"
              height="1120px"
            />
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

ToplineIndicators.propTypes = {
  page: PropTypes.string.isRequired,
};

export default ToplineIndicators;
