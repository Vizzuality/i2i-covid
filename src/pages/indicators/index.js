import { connect } from 'react-redux';

import Component from './component';

const mapStateToProps = (state) => ({
  current: state.location.payload.category,
  iso: state.location.payload.iso,
  page: state.page,
});

export default connect(mapStateToProps)(Component);
