import cartoApi from 'utils/carto-api';

export const fetchIndicators = (
  { title, columns, weight, calc, iso, exclude_query, sort_by },
  filters = {}
) => {
  let query;

  const filtersQuery = Object.keys(filters)
    .map((filterKey) => {
      const filter = filters[filterKey];
      if (filter && filter.length) {
        return ` AND ${filterKey} IN ('${filter.join("', '")}')`;
      }
      return '';
    })
    .join('');

  const sortByQuery = sort_by ? `ORDER BY ${sort_by}` : '';

  if (calc === 'average') {
    const selectQuery = columns
      .map((column) => `AVG(${column}::float * ${weight}) AS ${column}`)
      .join(', ');
    const valuesQuery = columns
      .map((column) => `(a.${column}, '${column}', a.update_date)`)
      .join(', ');
    const undefinedValues = exclude_query
      .filter((value) => String(value).toLowerCase() !== 'null')
      .map((param) => {
        const paramToNumber = Number(param);
        if (param !== '' && param !== ' ' && !isNaN(paramToNumber)) {
          return Number(paramToNumber);
        }
        return param;
      });
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
      SELECT b.answer, b.indicator, b.update_date, m.label, b.answer AS value,
        COUNT(b.answer) OVER() as responders
      FROM b
      LEFT JOIN covid_metadata m ON m.field_name = indicator
      ${sortByQuery}
    `;
  } else {
    const selectQuery = columns.join(', ');
    const valuesQuery = columns
      .map((column) => `(a.${column}, '${column}', a.${weight}, a.update_date)`)
      .join(', ');
    const undefinedValues = exclude_query.map((param) => `'${param}'`);
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
        SELECT answer, indicator, label, update_date,
          SUM(${weight}) AS value,
          count(answer) AS responders
        FROM c
        WHERE ${whereQuery} ${weight} != 'NaN'
        GROUP BY answer, indicator, update_date, label
      )
      SELECT d.answer, d.indicator, d.label, d.update_date,
        (d.value * 100 / SUM(d.value) OVER(PARTITION BY indicator, update_date)) as value,
        SUM(d.responders) OVER() AS responders
      FROM d
      ${sortByQuery}
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

export const fetchTotalSize = (iso) => {
  const query = `
  SELECT update_date
  FROM ${process.env.REACT_APP_DATA_TABLENAME}
  WHERE country_iso = '${iso}'`;
  return cartoApi(query);
};

export default { fetchIndicators, fetchAllData };
