import React from 'react';
import PropTypes from 'prop-types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useMediaQuery } from 'react-responsive';

// constants
import { getWidgetTheme } from './utils';

const UIBarChart = ({ data, config, widgetSpec }) => {
  const isMobileScreen = useMediaQuery({ query: '(max-width: 1024px)' });
  const { chart: chartType } = widgetSpec;
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
  const defaultBarProps = {};

  if (chartType === 'stacked-bar' || chartType === 'multiple-stacked-bar') {
    defaultBarProps.stackId = 'a';
  }

  return (
    <div className="c-chart">
      <ResponsiveContainer {...layout}>
        <BarChart data={data}>
          <CartesianGrid {...cartesianGrid} />
          <XAxis {...xAxis} dataKey={groupBy} />
          <YAxis {...yAxis} />
          <Tooltip {...tooltip} />
          {categories.map((_category, index) => (
            <Bar
              {...bar}
              {...defaultBarProps}
              dataKey={_category}
              key={_category}
              fill={colors(_category, index)}
            />
          ))}
          {chartType !== 'multiple-bar' && <Legend {...legend} />}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

UIBarChart.propTypes = {
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

export default UIBarChart;
