import React from 'react';
import PropTypes from 'prop-types';
import useAxios from 'axios-hooks';

import Chart from 'components/chart';
import Share from 'components/share';
import Spinner from 'components/spinner';
import { capitalize } from 'utils/strings';
import { fetchIndicators } from 'services/indicators';
import { getWidgetProps } from './utils.js';
// import { formatNumber } from 'utils/numbers';

const Widget = (widgetSpec) => {
  const { title, slug, filters, hint } = widgetSpec;
  const [{ data, loading, error }] = useAxios(fetchIndicators(widgetSpec, filters));
  const widgetProps = data && getWidgetProps(data.rows, widgetSpec);
  const activeFilters = Object.values(filters)
    .filter((filter) => filter.length > 0)
    .flat()
    .map(capitalize);

  // For widget debugging
  if (error) console.error(`For widget ${title}`, error.response.data);

  // const responders = !!(data && data.rows.length) && data.rows[0].responders;
  return (
    <div className="c-widget">
      <div className="widget-header">
        <h2 className="h3">{title}</h2>
        <p className="small">
          {hint && hint.length && `${capitalize(hint)}. `}
          {activeFilters && activeFilters.length > 0 && `Filtered by ${activeFilters.join(', ')}. `}
          {/*responders && `${formatNumber(responders)} responder${responders > 1 ? 's' : ''}.`*/}
        </p>
      </div>
      {loading && <Spinner loading />}
      {!loading && error && <div className="alert alert-warning">Something was wrong.</div>}
      {!loading && data && !error && (
        <>
          <Chart {...widgetProps} />
          <Share slug={slug} />
        </>
      )}
      {!loading && !data && !error && (
        <div className="alert alert-info">There is no data for this widget.</div>
      )}
    </div>
  );
};

Widget.propTypes = {
  title: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
};

export default Widget;
