import React from 'react';
import PropTypes from 'prop-types';
import BarChart from 'components/chart/bar';
import LineChart from 'components/chart/line';

const chartsMap = {
  'line-chart': LineChart,
  'multiple-bar': BarChart,
  'multiple-stacked-bar': BarChart,
  'single-bar': BarChart,
  'stacked-bar': BarChart,
};

const Chart = (props) => {
  const {
    widgetSpec: { chart },
  } = props;
  const ChartComponent = chartsMap[chart];

  if (!ChartComponent) {
    console.error(
      `Chart specified is not supported. They should be ${Object.keys(chartsMap).join(', ')}`
    );
    return null;
  }

  return <ChartComponent {...props} />;
};

Chart.propTypes = {
  widgetSpec: PropTypes.shape({
    calc: PropTypes.oneOf(['average', 'percentage']),
    chart: PropTypes.oneOf([
      'single-bar',
      'multiple-bar',
      'stacked-bar',
      'multiple-stacked-bar',
      'line',
    ]).isRequired,
    gridspace: PropTypes.oneOf(['one', 'half']),
  }).isRequired,
};

export default Chart;
