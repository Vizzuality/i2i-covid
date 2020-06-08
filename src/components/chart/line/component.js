import React from 'react';
import PropTypes from 'prop-types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useMediaQuery } from 'react-responsive';

// constants
import { getWidgetTheme } from './constants';

const UILineChart = ({ data, config, widgetSpec }) => {
  const isMobileScreen = useMediaQuery({ query: '(max-width: 1024px)' });
  const {
    layout,
    cartesianGrid,
    xAxis,
    yAxis,
    tooltip,
    legend,
    colors: defaultColors,
    bar,
  } = getWidgetTheme({ data, ...widgetSpec, isMobileScreen, widgetSpec });
  const { groupBy, categories, colors: colorsConfig } = config;
  const colors = colorsConfig || defaultColors;
  const defaultLineProps = {};

  return (
    <div className="c-chart">
      <ResponsiveContainer {...layout}>
        <LineChart data={data}>
          <CartesianGrid {...cartesianGrid} />
          <XAxis {...xAxis} dataKey={groupBy} />
          <YAxis {...yAxis} />
          <Tooltip {...tooltip} />
          {categories.map((_category, index) => (
            <Line
              {...bar}
              {...defaultLineProps}
              dataKey={_category}
              key={_category}
              stroke={colors(_category, index)}
            />
          ))}
          <Legend {...legend} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

UILineChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})),
  config: PropTypes.shape({
    groupBy: PropTypes.string,
    categories: PropTypes.array,
    colors: PropTypes.func,
  }).isRequired,
  widgetSpec: PropTypes.shape({
    chart: PropTypes.oneOf(['single-bar', 'multiple-bar', 'stacked-bar', 'multiple-stacked-bar']),
  }).isRequired,
};

UILineChart.defaultProps = {
  data: null,
};

export default UILineChart;
