import React from 'react';
import PropTypes from 'prop-types';
import BarChart from 'components/chart/bar';
import LineChart from 'components/chart/line';
import AreaChart from 'components/chart/area';

const chartsMap = {
  'line-chart': LineChart,
  'area-chart': AreaChart,
  'multiple-bar': BarChart,
  'multiple-stacked-bar': BarChart,
  'single-bar': BarChart,
  'stacked-bar': BarChart,
};

const Chart = (props) => {
  const {
    widgetSpec: { chart },
    data,
  } = props;

  const ChartComponent = chartsMap[chart];

  if (!ChartComponent) {
    console.error(
      `Chart specified is not supported. They should be ${Object.keys(chartsMap).join(', ')}`
    );
    return null;
  }

  if ((chart === 'line-chart' || chart === 'area-chart') && data.length < 3) {
    return <BarChart {...props} />;
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
  data: PropTypes.shape({}).isRequired,
};

export default Chart;
