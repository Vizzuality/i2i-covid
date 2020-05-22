import React from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import { breakpoints } from 'utils/responsive';
import Disclaimer from 'components/disclaimer';
import Subscribe from 'components/subscribe';
import DownloadForm from 'components/download-form';
import PageSwitch from 'components/page-switch';

import logo from './logo.svg';

const Header = ({ page }) => (
  <header className="c-header">
    <Disclaimer />
    <div className="container">
      <div className="row">
        <div className="col-sm-12 col-md-3">
          <a href="/">
            <img src={logo} alt="i2i Covid Logo" className="logo-img" />
          </a>
        </div>
        <div className="col-sm-12 col-md-9 d-flex justify-content-sm-center justify-content-md-end">
          <div className="header-buttons">
            <MediaQuery minWidth={breakpoints.md - 1}>
              {page !== 'Indicators' && (
                <PageSwitch name="Topline indicators" type="INDICATORS" pathname="/indicators" />
              )}
              {page !== 'Resources' && (
                <PageSwitch name="Resources" type="RESOURCES" pathname="/resources" />
              )}
              <Subscribe />
              <DownloadForm />
            </MediaQuery>
          </div>
        </div>
      </div>
    </div>
  </header>
);

Header.propTypes = {
  page: PropTypes.string.isRequired,
};

export default Header;
