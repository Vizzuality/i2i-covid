import React, { useMemo } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import Widget from 'components/widget';
import widgetsSpec from 'data/widgets.json';

const Widgets = ({ category, iso, filterBySummary }) => {
  const widgetsSpecByCategory = useMemo(
    // TODO: Implement order by here
    () => {
      if (filterBySummary) {
        return widgetsSpec.filter(
          (widgetSpec) => widgetSpec.category === category && widgetSpec.summary
        );
      }
      return widgetsSpec.filter((widgetSpec) => widgetSpec.category === category);
    },
    [category, filterBySummary]
  );

  return (
    <div className="c-widgets">
      <div className="row justify-content-md-center">
        {widgetsSpecByCategory.map((widgetSpec) => (
          <div
            key={widgetSpec.slug}
            className={classnames({
              'col-sm-12 col-md-6': widgetSpec.gridspace === 'half',
              'col-sm-12 col-md-12': widgetSpec.gridspace === 'one',
            })}
          >
            <Widget iso={iso} {...widgetSpec} />
          </div>
        ))}
      </div>
    </div>
  );
};

Widgets.propTypes = {
  category: PropTypes.string.isRequired,
  iso: PropTypes.string.isRequired,
  filterBySummary: PropTypes.bool,
};

Widgets.defaultProps = {
  filterBySummary: false,
};

export default Widgets;
