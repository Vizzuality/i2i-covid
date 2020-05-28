import React from 'react';
import PropTypes from 'prop-types';
import Link from 'redux-first-router-link';
import Widgets from 'components/widgets';

const Summary = ({ iso, categories }) => {
  return (
    <section className="c-summary">
      <div className="row">
        <div className="col-12">
          {categories.map(({ name, slug, description }) =>
            description ? (
              <article key={slug} className="summary-content">
                <header>
                  <div className="row">
                    <div className="col-sm-10 col-md-8 m-auto">
                      <h2 className="text-center">{name}</h2>
                      {description && <p>{description}</p>}
                    </div>
                  </div>
                </header>

                <Widgets iso={iso} category={slug} filterBySummary />
                <aside className="summary-button">
                  <div className="row">
                    <div className="col d-flex justify-content-center">
                      <Link
                        to={{
                          type: 'COUNTRY',
                          payload: { iso, category: slug },
                        }}
                      >
                        Know more
                      </Link>
                    </div>
                  </div>
                </aside>
              </article>
            ) : null
          )}
        </div>
      </div>
    </section>
  );
};

Summary.propTypes = {
  iso: PropTypes.string.isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Summary;
