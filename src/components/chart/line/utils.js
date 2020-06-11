import { colors } from 'components/chart/constants';
import { capitalize } from 'utils/strings';
import { formatNumber } from 'utils/numbers';
import { getCurrency } from 'utils/currency';

const defaultLegend = {
  iconSize: 15,
  iconType: 'circle',
  formatter: capitalize,
};

export const getWidgetTheme = ({ data, chart, calc, gridspace, units, iso, isMobileScreen }) => {
  let legend = { ...defaultLegend };

  if (gridspace === 'one' && !isMobileScreen) {
    legend = {
      ...defaultLegend,
      align: 'right',
      layout: 'vertical',
      verticalAlign: 'middle',
      width: 300,
      wrapperStyle: {
        paddingLeft: 30,
      },
    };
  }

  return {
    layout: { width: '100%', height: 500 },
    cartesianGrid: {
      strokeDasharray: '5 4',
      stroke: '#001D22',
      opacity: 0.2,
      vertical: false,
    },
    colors: (category, index) => colors(index),
    xAxis: {
      interval: 'preserveStartEnd',
      tick: {
        fontSize: '12px',
        fill: '#022732',
      },
      tickMargin: 5,
    },
    yAxis: {
      width: isMobileScreen ? 60 : 80,
      type: 'number',
      domain: [0, calc === 'percentage' ? 100 : 'auto'],
      tickLine: false,
      axisLine: false,
      tickFormatter: formatNumber,
      tick: {
        fontSize: '13px',
        fill: '#022732',
      },
      unit: units === 'currency' ? getCurrency(iso) : units,
    },
    tooltip: {
      cursor: false,
      isAnimationActive: false,
      formatter: (value) => {
        if (calc === 'percentage') return `${formatNumber(value)} %`;
        return formatNumber(value);
      },
    },
    legend,
  };
};

export default { getWidgetTheme };
