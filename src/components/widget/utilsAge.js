import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import { capitalize } from 'utils/strings';
import uniq from 'lodash/uniq';

export const parseSingleChart = (data, { calc, category_order }) => {
  const groupedData = groupBy(data, (d) => d.ps5_age_group);
  const ages = Object.keys(groupedData);
  const widgetData = ages.map((age) => {
    const arr = groupedData[age];
    const obj = {
      ps5_age_group: age,
    };

    arr.forEach(({ value, answer, label }) => {
      obj[calc === 'average' ? label : answer] = value;
    });
    return obj;
  });

  const categories = category_order || uniq(map(data, calc === 'average' ? 'label' : 'answer').map((d) => String(d)));

  return {
    config: {
      groupBy: 'ps5_age_group',
      categories,
    },
    data: widgetData,
  };
};

export const parseStackedChart = (data, { category_order }) => {
  const groupedData = groupBy(data, (d) => d.ps5_age_group);
  const answers = Object.keys(groupedData);
  const categories = category_order || uniq(map(data, 'answer').map((d) => String(d)));

  const widgetData = answers.map((a) => {
    const arr = groupedData[a];
    const obj = {
      ps5_age_group: a,
    };

    arr.forEach(({ value, answer }) => {
      obj[answer] = value;
    });

    return obj;
  });

  return {
    config: {
      groupBy: 'ps5_age_group',
      categories,
      yAxis: {
        domain: [0, 100],
      },
    },
    data: widgetData,
  };
};

export const parseMultipleStackedChart = (data, { columns }) => {
  const parsedData = data.map((d) => ({ ...d, answer: capitalize(d.answer) }));
  const wavesData = groupBy(parsedData, (d) => d.ps5_age_group);
  const widgetData = Object.keys(wavesData).map((waveKey) => {
    const arr = wavesData[waveKey];
    const obj = {};

    if (!arr) {
      console.error(`Indicator ${waveKey} doesn't exist`);
      return null;
    }

    arr.forEach(({ answer, value }) => {
      obj[answer] = value;
    });

    return {
      ...obj,
      ps5_age_group: waveKey,
    };
  });
  const categories = columns
    .map((column) => {
      const category = parsedData.find((d) => d.indicator === column);
      if (category) return category.label;
      return null;
    })
    .filter((cat) => cat);

  return {
    config: {
      groupBy: 'ps5_age_group',
      categories,
      stacked: false,
    },
    data: widgetData,
  };
};

export const parseMultipleChart = (data, { columns }) => {
  const parsedData = data.map((d) => ({ ...d, answer: capitalize(d.answer) }));
  const wavesData = groupBy(parsedData, (d) => d.ps5_age_group);
  const widgetData = Object.keys(wavesData).map((waveKey) => {
    const arr = wavesData[waveKey];
    const obj = {};

    if (!arr) {
      console.error(`Indicator ${waveKey} doesn't exist`);
      return null;
    }

    arr.forEach(({ label, value }) => {
      obj[label] = value;
    });

    return {
      ...obj,
      ps5_age_group: waveKey,
    };
  });

  const categories = columns
    .map((column) => {
      const category = parsedData.find((d) => d.indicator === column);
      if (category) return category.label;
      return null;
    })
    .filter((cat) => cat);

  return {
    config: {
      groupBy: 'ps5_age_group',
      categories,
      stacked: false,
    },
    data: widgetData,
  };
};

export const parseGenericChart = (data, { calc, category_order }) => {
  let resultData = data;
  if (category_order) {
    resultData = category_order.map((category) => {
      const d = data.find(({ answer }) => category === answer);
      if (!d) {
        console.error(`Answer ${category} doesn't exist`);
        return null;
      }
      return d;
    });
  }

  return {
    config: {
      groupBy: calc === 'average' ? 'label' : 'answer',
      categories: ['value'],
    },
    data: resultData,
  };
};

export const getWidgetProps = (data, widgetSpec) => {
  const { calc, chart, exclude_chart, category_order, waves, columns } = widgetSpec;

  // Deciding not to show some values depending on WidgetSpec
  const dataResult = data.filter((d) => !exclude_chart.includes(d.answer));
  // const waves = data.map((d) => d.ps5_age_group);
  // const waves_length = waves.filter((el, index) => waves.indexOf(el) === index).length;

  /**
   * https://recharts.org/en-US/examples/SimpleBarChart
   *
   * Data:
   * [{
   *   "ps5_age_group": "wave",
   *   "answer1": 1,
   *   "answer2": 2,
   *   "answer3": 3,
   * }]
   * NOTE: One item per wave
   *
   * Categories:
   * ["answer1", "answer2", "answer3"]
   *
   * Order:
   * - category_order when exists
   * - sort_by attribute applied in SQL
   */
  if (chart === 'single-bar') {
    return { ...parseSingleChart(dataResult, { calc, category_order }), widgetSpec };
  }

  /**
   * https://recharts.org/en-US/examples/StackedBarChart
   * Data format:
   * [{
   *   "ps5_age_group": "wave",
   *   "answer1": 1,
   *   "answer2": 2,
   *   "answer3": 3,
   * }]
   * NOTE: One item per wave. Same as above, but including stackId.
   *
   * Categories:
   * ["answer1", "answer2", "answer3"]
   *
   * Order:
   * - category_order when exists
   * - sort_by attribute applied in SQL
   */
  if (chart === 'stacked-bar' || chart === 'area-chart') {
    return { ...parseStackedChart(dataResult, { category_order }), widgetSpec };
  }

  if (chart === 'multiple-stacked-bar') {
    return { ...parseMultipleStackedChart(dataResult, { columns }), widgetSpec };
  }

  if ((chart === 'multiple-bar' && waves && waves > 1) || chart === 'line-chart') {
    return { ...parseMultipleChart(dataResult, { columns }), widgetSpec };
  }

  return { ...parseGenericChart(dataResult, { calc, category_order }), widgetSpec };
};

export default { getWidgetProps };
