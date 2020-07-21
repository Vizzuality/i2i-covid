import cartoApi from 'utils/carto-api';

export const fetchWaves = (iso='') => {
  const query = `
    SELECT DISTINCT waves_data, country_iso
    FROM ${process.env.REACT_APP_DATA_TABLENAME}
    WHERE country_iso='${iso}'
  `;
  return cartoApi(query);
};

export default { fetchWaves };
