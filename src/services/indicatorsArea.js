import cartoApi from 'utils/carto-api';

export const fetchIndicators = (
  { title, columns, weight, calc, iso, exclude_query, sort_by },
  filters = {}, wave = ''
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

  const sortByQuery = sort_by ? `ORDER BY ur, ${sort_by}` : 'ORDER BY ur';

  if (calc === 'average') {
    const selectQuery = columns
      .map((column) => `AVG(${column}::float * ${weight}) AS ${column}`)
      .join(', ');
    const valuesQuery = columns
      .map((column) => `(a.${column}, '${column}', a.ur)`)
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
        SELECT ${selectQuery}, ur, waves_data
        FROM ${process.env.REACT_APP_DATA_TABLENAME}
        WHERE waves_data='${wave}' AND country_iso = '${iso}' ${filtersQuery}
          AND ${whereQuery}
        GROUP BY ur
      ), b as (
        SELECT t.*
        FROM a
        CROSS JOIN LATERAL (
          VALUES ${valuesQuery}
        ) AS t(answer, indicator, ur, waves_data)
      )
      SELECT b.answer, b.indicator, b.ur, b.waves_data, m.label, b.answer AS value,
        COUNT(b.answer) OVER() as responders
      FROM b
      LEFT JOIN ${process.env.REACT_APP_METADATA_TABLENAME} m ON m.field_name = indicator
      ${sortByQuery}
    `;
  } else {
    const selectQuery = columns.join(', ');
    const valuesQuery = columns
      .map((column) => `(a.${column}, '${column}', a.${weight}, a.ur, a.waves_data)`)
      .join(', ');
    const undefinedValues = exclude_query.map((param) => `'${param}'`);
    const whereQuery = undefinedValues.length
      ? `answer NOT IN (${undefinedValues.join(',')}) AND`
      : '';

    query = `
      WITH a as (
        SELECT ${selectQuery}, ${weight}, ur, waves_data
        FROM ${process.env.REACT_APP_DATA_TABLENAME}
        WHERE waves_data='${wave}' AND country_iso = '${iso}' ${filtersQuery}
      ), b as (
        SELECT t.*
        FROM a
        CROSS JOIN LATERAL (
          VALUES ${valuesQuery}
        ) AS t(answer, indicator, ${weight}, ur, waves_data)
      ), c as (
        SELECT b.answer, b.indicator, b.${weight}, b.ur, b.waves_data, m.label
        FROM b
        LEFT JOIN ${process.env.REACT_APP_METADATA_TABLENAME} m ON m.field_name = indicator
      ), d as (
        SELECT answer, indicator, label, ur, waves_data,
          SUM(${weight}) AS value,
          count(answer) AS responders
        FROM c
        WHERE ${whereQuery} ${weight} != 'NaN'
        GROUP BY answer, indicator, ur, waves_data, label
      )
      SELECT d.answer, d.indicator, d.label, d.ur, d.waves_data,
        (d.value * 100 / SUM(d.value) OVER(PARTITION BY indicator, ur)) as value,
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
  SELECT ur
  FROM ${process.env.REACT_APP_DATA_TABLENAME}
  WHERE country_iso = '${iso}'`;
  return cartoApi(query);
};

export default { fetchIndicators, fetchAllData };
