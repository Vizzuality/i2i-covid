import { connect } from 'react-redux';
import { resetFilters, setFilter } from 'modules/filters/actions';

import Component from './component';

const mapStateToProps = (state) => ({
  location: state.location,
  iso: state.location.payload.iso,
  query: state.location.search,
  filters: state.filters,
});

const mapDispatchToProps = {
  resetFilters,
  setFilter,
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
