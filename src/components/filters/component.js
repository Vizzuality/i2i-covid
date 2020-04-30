import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { replace } from 'redux-first-router';
import queryString from 'query-string';
import isArray from 'lodash/isArray';
import Button from 'components/button';
import Modal from 'components/modal';
import initialState from 'modules/filters/initial-state';
import { filtersData } from './constants';

const Filters = ({ location, filters, resetFilters, setFilter }) => {
  const { pathname, query } = location;
  const queryFilters = {};

  if (query) {
    Object.keys(query).forEach((key) => {
      queryFilters[key] = isArray(query[key]) && query[key].length ? query[key] : [query[key]];
    });
  }

  const [filtersResult, setFiltersResult] = useState({ ...filters, ...queryFilters });
  const [isOpen, toggleModal] = useState(false);

  const handleToggleModal = () => toggleModal(!isOpen);

  const handleReset = () => {
    setFiltersResult({ ...initialState });
    resetFilters();
    replace({ pathname });
    handleToggleModal();
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    setFilter(filtersResult);
    // Updating URL
    replace({
      pathname,
      search: `?${queryString.stringify(filtersResult)}`
    });
    handleToggleModal();
  };

  const handleChange = (e) => {
    const { name, checked, value } = e.target;
    let filterItem = [...filtersResult[name]];
    const isAlready = filterItem.includes(value);

    if (checked && !isAlready) {
      filterItem.push(value);
    } else if (!checked && isAlready) {
      filterItem = filterItem.filter((item) => item !== value);
    }

    setFiltersResult({ ...filtersResult, [name]: filterItem });
  };

  const numberOfFilters = Object.keys(filtersResult)
    .map((key) => filtersResult[key].length)
    .reduce((prev, current) => prev + current);

  return (
    <div className="c-filters">
      <Button onClick={handleToggleModal} className="-color-2 display-btn">
        Filter by {numberOfFilters} indicator{numberOfFilters > 1 ? 's' : ''}
      </Button>
      <Modal
        isOpen={isOpen}
        title="Select filters"
        type="filters"
        onRequestClose={() => toggleModal(false)}
        actionsComponent={() => (
          <div className="c-filters-action-buttons">
            <Button className="-border-color-1 -medium" onClick={handleReset}>
              Reset
            </Button>
            <Button className="-color-2 -medium" onClick={handleSubmit}>
              Apply
            </Button>
          </div>
        )}
      >
        <form className="modal-filters" onSubmit={handleSubmit}>
          {filtersData.map((filter) => (
            <div key={filter.column} className="form-group">
              <h3>{filter.title}</h3>
              {filter.options.map((opt) => (
                <div className="form-check form-check-inline" key={opt.value}>
                  <input
                    type="checkbox"
                    id={opt.value}
                    name={filter.column}
                    className="form-check-input"
                    value={opt.value}
                    onChange={handleChange}
                    checked={filtersResult[filter.column].includes(opt.value)}
                  />
                  <label className="form-check-label" htmlFor={opt.value}>
                    {opt.label}
                  </label>
                </div>
              ))}
            </div>
          ))}
        </form>
      </Modal>
    </div>
  );
};

Filters.propTypes = {
  location: PropTypes.shape({
    query: PropTypes.shape({}),
    pathname: PropTypes.string,
  }),
  filters: PropTypes.shape({
    gender: PropTypes.array,
    area: PropTypes.array,
    age: PropTypes.array,
  }),
  resetFilters: PropTypes.func.isRequired,
  setFilter: PropTypes.func.isRequired,
};

Filters.defaultProps = {
  filters: PropTypes.shape({
    gender: [],
    area: [],
    age: [],
  }),
};

export default Filters;
