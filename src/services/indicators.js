import cartoApi from 'utils/carto-api';

export const fetchIndicators = ({ columns, weight, calc, iso, exclude_query }, filters = {}) => {
  let query;

  const undefinedValues = exclude_query
    .filter((value) => String(value).toLowerCase() !== 'null')
    .map((param) => {
      if (param !== '' && param !== ' ' && typeof Number(param) === 'number') return Number(param);
      return `'${param}'`;
    });

  const filtersQuery = Object.keys(filters)
    .map((filterKey) => {
      const filter = filters[filterKey];

      if (filter && filter.length) {
        return ` AND ${filterKey} IN ('${filter.join("', '")}')`;
      }
      return '';
    })
    .join('');

  if (calc === 'average') {
    const selectQuery = columns
      .map((column) => `AVG(${column}::float * ${weight}) AS ${column}`)
      .join(', ');
    const valuesQuery = columns
      .map((column) => `(a.${column}, '${column}', a.update_date)`)
      .join(', ');
    const whereQuery = columns
      .map((column) => {
        if (undefinedValues.length) {
          return `${column} IS NOT NULL AND ${column} NOT IN (${undefinedValues.join(',')})`;
        }
        return `${column} IS NOT NULL`;
      })
      .join(' AND ');

    query = `
      WITH a as (
        SELECT ${selectQuery}, update_date
        FROM ${process.env.REACT_APP_DATA_TABLENAME}
        WHERE country_iso = '${iso}' ${filtersQuery}
          AND ${whereQuery}
        GROUP BY update_date
      ), b as (
        SELECT t.*
        FROM a
        CROSS JOIN LATERAL (
          VALUES ${valuesQuery}
        ) AS t(answer, indicator, update_date)
      )
      SELECT b.answer, b.indicator, b.update_date, m.label, b.answer AS value
      FROM b
      LEFT JOIN covid_metadata m ON m.field_name = indicator
      ORDER BY answer DESC
    `;
  } else {
    const selectQuery = columns.join(', ');
    const valuesQuery = columns
      .map((column) => `(a.${column}, '${column}', a.${weight}, a.update_date)`)
      .join(', ');
    const whereQuery = undefinedValues.length
      ? `answer NOT IN (${undefinedValues.join(',')}) AND`
      : '';

    query = `
      WITH a as (
        SELECT ${selectQuery}, ${weight}, update_date
        FROM ${process.env.REACT_APP_DATA_TABLENAME}
        WHERE country_iso = '${iso}' ${filtersQuery}
      ), b as (
        SELECT t.*
        FROM a
        CROSS JOIN LATERAL (
          VALUES ${valuesQuery}
        ) AS t(answer, indicator, ${weight}, update_date)
      ), c as (
        SELECT b.answer, b.indicator, b.${weight}, b.update_date, m.label
        FROM b
        LEFT JOIN covid_metadata m ON m.field_name = indicator
      ), d as (
        SELECT answer, indicator, label, update_date, SUM(${weight}) AS value FROM c
        WHERE ${whereQuery} ${weight} != 'NaN'
        GROUP BY answer, indicator, update_date, label
      )
      SELECT d.answer, d.indicator, d.label, d.update_date, (d.value * 100 / SUM(d.value) OVER(PARTITION BY indicator)) as value
      FROM d
      ORDER BY d.answer
    `;
  }

  return cartoApi(query);
};

export const fetchAllData = ({ format = 'json' }) => {
  const query = `
    SELECT *
    FROM ${process.env.REACT_APP_DATA_TABLENAME}
  `;

  return cartoApi(query, format);
};

export default { fetchIndicators, fetchAllData };
