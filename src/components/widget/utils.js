import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import { capitalize } from 'utils/strings';

export const parseSingleChart = (data, { calc, columns }) => {
  const groupedData = groupBy(data, (d) => d.update_date);
  const dates = Object.keys(groupedData);
  const widgetData = dates.map((date) => {
    const arr = groupedData[date];
    const obj = {
      update_date: date,
    };

    arr.forEach(({ value, answer, label }) => {
      obj[calc === 'average' ? label : answer] = value;
    });

    return obj;
  });

  const categories = map(data, calc === 'average' ? 'label' : 'answer').map((d) => String(d));

  widgetData.sort((a, b) => (a.update_date > b.update_date ? 1 : -1));

  return {
    config: {
      groupBy: 'update_date',
      categories,
    },
    data: widgetData,
  };
};

export const parseStackedChart = (data, { calc, category_order, sort_by }) => {
  const groupedData = groupBy(data, (d) => d.update_date);
  const dates = Object.keys(groupedData);
  const categories = category_order || map(data, 'answer').map((d) => String(d)) || sort_by;

  const widgetData = dates.map((date) => {
    const arr = groupedData[date];
    const obj = {
      update_date: date,
    };

    arr.forEach(({ value, answer }) => {
      obj[answer] = value;
    });

    return obj;
  });

  widgetData.sort((a, b) => (a.update_date > b.update_date ? 1 : -1));

  return {
    config: {
      groupBy: calc === 'percentage_no_date' ? 'answer' : 'update_date',
      categories,
      yAxis: {
        domain: [0, 100],
      },
    },
    data: widgetData,
  };
};

export const parseMultipleStackedChart = (data, { columns }) => {
  const resultData = data;

  const parsedData = resultData.map((d) => ({ ...d, answer: capitalize(d.answer) }));

  const wavesData = groupBy(parsedData, (d) => d.update_date);
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
      update_date: waveKey,
    };
  });
  const categories = columns
    .map((column) => {
      const category = parsedData.find((d) => d.indicator === column);
      if (category) return category.label;
      return null;
    })
    .filter((cat) => cat);

  widgetData.sort((a, b) => (a.update_date > b.update_date ? 1 : -1));

  return {
    config: {
      groupBy: 'update_date',
      categories,
      stacked: false,
    },
    data: widgetData,
  };
};

export const parseMultipleChart = (data, { columns }) => {
  const parsedData = data.map((d) => ({ ...d, answer: capitalize(d.answer) }));

  const wavesData = groupBy(parsedData, (d) => d.update_date);
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
      update_date: waveKey,
    };
  });
  const categories = columns
    .map((column) => {
      const category = parsedData.find((d) => d.indicator === column);
      if (category) return category.label;
      return null;
    })
    .filter((cat) => cat);

  widgetData.sort((a, b) => (a.update_date > b.update_date ? 1 : -1));

  return {
    config: {
      groupBy: 'update_date',
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

  resultData.sort((a, b) => (a.update_date > b.update_date ? 1 : -1));

  return {
    config: {
      groupBy: calc === 'average' ? 'label' : 'answer',
      categories: ['value'],
    },
    data: resultData,
  };
};

export const getWidgetProps = (data, widgetSpec) => {
  const { calc, chart, exclude_chart, category_order, sort_by, waves, columns } = widgetSpec;

  // Deciding not to show some values depending on WidgetSpec
  const dataResult = data.filter((d) => !exclude_chart.includes(d.answer));

  if (chart === 'single-bar') {
    return { ...parseSingleChart(dataResult, { calc, columns }), widgetSpec };
  }

  if (chart === 'stacked-bar') {
    return { ...parseStackedChart(dataResult, { calc, category_order, sort_by }), widgetSpec };
  }

  if (chart === 'multiple-stacked-bar') {
    return { ...parseMultipleStackedChart(dataResult, { columns }), widgetSpec };
  }

  if (chart === 'multiple-bar' && waves && waves > 1) {
    return { ...parseMultipleChart(dataResult, { columns }), widgetSpec };
  }

  return { ...parseGenericChart(dataResult, { calc, category_order }), widgetSpec };
};

export default { getWidgetProps };
