import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactGA from 'react-ga';
import useAxios from 'axios-hooks';

import Header from 'components/header';
import Hero from 'components/hero';
import Footer from 'components/footer';
import Spinner from 'components/spinner';
import Navigation from 'components/navigation';
import CardInfo from 'components/card';
import Summary from 'components/summary';
import { fetchCategories } from 'services/categories';

const CountryPage = ({ page, location }) => {
  const { payload, pathname } = location;
  const { iso, category: current } = payload;
  const [{ data, loading }] = useAxios(fetchCategories());
  const categories = data && data.rows ? data.rows : [];
  const { name, description } = categories.find(({ slug }) => slug === current) || {
    name: 'Summary',
  };

  const addSummary = (tabs, summary) => {
    const index = tabs.findIndex((e) => console.log(e) || e.name === summary.name);
    index === -1 ? tabs.unshift(summary) : (tabs[index] = summary);
  };

  const summary = { name: 'Summary', slug: 'summary', description: false };
  const tabs = categories;
  addSummary(tabs, summary);

  useEffect(() => {
    ReactGA.pageview(pathname);
  }, [pathname]);

  return (
    <div className="l-country">
      <Header />
      <Hero iso={iso} page={page} />

      <div className="country-content">
        <div className="container country-content-decoration" />
        <div className="container">
          <div className="row">
            <div className="col">
              {loading && <Spinner />}
              {data && !loading && (
                <>
                  <Navigation tabs={tabs} iso={iso} currentTab={name} />
                  <div className="country-info">
                    {current === 'summary' ? (
                      <Summary categories={tabs} />
                    ) : (
                      <CardInfo
                        title={name}
                        description={description}
                        iso={iso}
                        category={current}
                      />
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

CountryPage.propTypes = {
  page: PropTypes.string.isRequired,
  location: PropTypes.shape({
    payload: PropTypes.shape({
      iso: PropTypes.string,
      category: PropTypes.string,
    }),
    pathname: PropTypes.string,
  }).isRequired,
};

export default CountryPage;
