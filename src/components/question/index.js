import { connect } from 'react-redux';

import Component from './component';

const mapStateToProps = (state) => ({
  iso: state.location.payload.iso,
  query: state.location.search,
});

export default connect(mapStateToProps)(Component);
