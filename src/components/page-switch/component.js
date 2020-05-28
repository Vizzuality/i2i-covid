import React from 'react';
import PropTypes from 'prop-types';
import NavLink from 'redux-first-router-link';

const PageSwitch = ({ name, type, pathname }) => (
  <div className="c-switch">
    <NavLink className="c-button -border-color-1" to={{ type: type, pathname: pathname }}>
      {name}
    </NavLink>
  </div>
);

PageSwitch.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired,
};

export default PageSwitch;
