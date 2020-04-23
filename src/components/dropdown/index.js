import { connect } from 'react-redux';

import Component from './component';

const mapStateToProps = (state) => ({
  current: state.location.payload.iso,
});

export default connect(mapStateToProps)(Component);
