import React from 'react';
import PropTypes from 'prop-types';
import useAxios from 'axios-hooks';
import MediaQuery from 'react-responsive';
import { breakpoints } from 'utils/responsive';
import Dropdown from 'components/dropdown';
import Filters from 'components/filters';
import DownloadForm from 'components/download-form';
import Subscribe from 'components/subscribe';
import PageSwitch from 'components/page-switch';
import { fetchCountries } from 'services/countries';
import { fetchTotalSize } from 'services/indicators';
import { formatNumber } from 'utils/numbers';

const Hero = ({ iso, page }) => {
  const [{ data }] = useAxios(fetchCountries());
  const [{ data: dataSize }] = useAxios(fetchTotalSize(iso));
  const totalSize = dataSize && dataSize.total_rows;

  const countries = data && data.rows ? data.rows : null;
  const current = countries ? countries.find((country) => country.iso === iso) : null;
  const options = countries ? countries.filter((country) => country.iso !== iso) : null;

  return (
    <section className="c-hero">
      <div className="container">
        <div className="row">
          <div className="col">
            {page === 'Country' && (
              <h1 className="hero-title">
                COVID-19 tracking survey status <br />
                in&nbsp;
                {options && <Dropdown options={options} current={current} />}
              </h1>
            )}
            {page === 'Indicators' && <h1 className="hero-title">Topline indicators</h1>}
            {page === 'Resources' && <h1 className="hero-title">Resources</h1>}
          </div>
        </div>
        {page === 'Country' && (
          <div className="row justify-content-center">
            <MediaQuery minWidth={breakpoints.lg - 1}>
              <div className="col-auto ml-auto mr-auto">
                <Filters />
              </div>
            </MediaQuery>
            <MediaQuery maxWidth={breakpoints.md}>
              {page !== 'indicators' && (
                <div className="col-auto">
                  <PageSwitch name="Topline indicators" type="INDICATORS" pathname="/indicators" />
                </div>
              )}
              {page !== 'resources' && (
                <div className="col-auto">
                  <PageSwitch name="Resources" type="RESOURCES" pathname="/resources" />
                </div>
              )}
              <div className="col-auto">
                <Subscribe />
              </div>
              <div className="col-auto">
                <DownloadForm />
              </div>
            </MediaQuery>
          </div>
        )}
        {page === 'Country' && (
          <div className="row justify-content-end">
            <div className="col-auto">
              <p className="size-text">Sample size: {formatNumber(totalSize)}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

Hero.propTypes = {
  iso: PropTypes.string,
  page: PropTypes.string.isRequired,
};

Hero.defaultProps = {
  iso: '',
};

export default Hero;
