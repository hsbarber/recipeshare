import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

class ScrollTop extends React.Component {
  componentDidUpdate(prevProps) {
    const { location } = this.props;
    if (location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    const { children } = this.props;

    return <Fragment>{children}</Fragment>;
  }
}

export default withRouter(ScrollTop);

ScrollTop.propTypes = {
  location: PropTypes.object,
  children: PropTypes.object,
};
