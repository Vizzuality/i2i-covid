import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { pathToAction } from 'redux-first-router';

import countries from 'pages/home/constants';
import routesMap from 'config/router';

const Dropdown = ({ current }) => {
  const currentCountry = countries.find(country => country.iso === current)
  const [country, setCountry] = useState(currentCountry.label);

  const handleChange = (e) => {
    pathToAction('/country/KEN/summary', routesMap);
    setCountry(e.currentTarget.value);
  };

  const enabledCountries = countries.filter(country => country.iso !== undefined)

  return (
    <div className="c-dropdown">
      <div className="select-container">
        <select className="dropdown-select" onChange={handleChange}>
          {enabledCountries.map(({ iso, label }) => (
            <option className="dropdown-option" key={iso} value={label}>
              {label}
            </option>
          ))}
        </select>
        <div className="selected-country">{country}</div>
      </div>
    </div>
  );
};

Dropdown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      iso: PropTypes.string.isRequired,
      country: PropTypes.string.isRequired,
    })
  ),
  current: PropTypes.shape({
    country: PropTypes.string.isRequired,
    iso: PropTypes.string.isRequired,
  }),
};

export default Dropdown;
