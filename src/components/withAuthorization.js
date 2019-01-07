import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import AuthUserContext from './AuthUserContext';
import { firebase } from '../firebase';
import * as routes from '../constants/routes';

const withAuthorization = authCondition => Component => {
  class WithAuthorizationComponent extends React.Component {
    componentDidMount() {
      const { history } = this.props;
      firebase.auth.onAuthStateChanged(authUser => {
        if (!authCondition(authUser)) {
          history.push(routes.SIGN_IN);
        }
      });
    }

    render() {
      const { user } = this.props;
      return (
        <AuthUserContext.Consumer>
          {authUser => (authUser ? <Component user={user} /> : null)}
        </AuthUserContext.Consumer>
      );
    }
  }
  WithAuthorizationComponent.propTypes = {
    history: PropTypes.object,
    user: PropTypes.string,
  };
  return withRouter(WithAuthorizationComponent);
};

export default withAuthorization;
withAuthorization.propTypes = {
  Component: PropTypes.element,
};
