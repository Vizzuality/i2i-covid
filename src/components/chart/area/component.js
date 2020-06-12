import React from 'react';
import PropTypes from 'prop-types';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useMediaQuery } from 'react-responsive';

// constants
import { getWidgetTheme } from './utils';

const UIAreaChart = ({ data, config, widgetSpec }) => {
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
  const defaultBarProps = { stackId: 'a' };

  return (
    <div className="c-chart">
      <ResponsiveContainer {...layout}>
        <AreaChart data={data}>
          <CartesianGrid {...cartesianGrid} />
          <XAxis {...xAxis} dataKey={groupBy} />
          <YAxis {...yAxis} />
          <Tooltip {...tooltip} />
          {categories.map((_category, index) => (
            <Area
              {...bar}
              {...defaultBarProps}
              dataKey={_category}
              key={_category}
              stroke={colors(_category, index)}
              fill={colors(_category, index)}
              fillOpacity={1}
            />
          ))}
          <Legend {...legend} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

UIAreaChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  config: PropTypes.shape({
    groupBy: PropTypes.string,
    categories: PropTypes.array,
    colors: PropTypes.func,
  }).isRequired,
  widgetSpec: PropTypes.shape({
    chart: PropTypes.oneOf([
      'single-bar',
      'multiple-bar',
      'stacked-bar',
      'multiple-stacked-bar',
      'line-chart',
      'area-chart',
    ]),
  }).isRequired,
};

export default UIAreaChart;
