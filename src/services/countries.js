import cartoApi from 'utils/carto-api';

export const fetchCountries = () => {
  const query = `
    SELECT country,
      country_iso as iso
    FROM ${process.env.REACT_APP_DATA_TABLENAME}
    GROUP BY country, country_iso
    ORDER BY country
  `;

  return cartoApi(query);
};

export const fetchCountriesByWave = (wave) => {
  const query = `
    SELECT country,
      country_iso as iso, waves_data
    FROM ${process.env.REACT_APP_DATA_TABLENAME}
    WHERE waves_data='${wave}'
    GROUP BY country, country_iso, waves_data
    ORDER BY country
  `;

  return cartoApi(query);
}

export default { fetchCountries, fetchCountriesByWave };
