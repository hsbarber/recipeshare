import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { auth } from '../firebase/firebase';
import * as routes from '../constants/routes';

const withCorrectAccount = Component => {
  class withCorrectAccountComponent extends React.Component {
    constructor() {
      super();
      this.state = {
        pending: true,
        loggedIn: undefined,
      };
    }

    componentWillMount() {
      auth.onAuthStateChanged(user => {
        this.setState({
          pending: false,
          loggedIn: !!user,
        });
      });
    }

    render() {
      const { recipes, user, match } = this.props;
      const { pending, loggedIn } = this.state;
      const findRecipe = recipes.filter(recipe =>
        recipe.user === user ? recipe : null
      );

      const recipeTitles = findRecipe.map(rec => rec.title.split(' ').join(''));
      if (pending) return null;
      return (
        <React.Fragment>
          {loggedIn && recipeTitles.indexOf(match.params.title) >= 0 ? (
            <Component {...this.props} />
          ) : (
            <div className="component-error">
              <h1>Page not found!</h1>
              <h4>You may need to sign in to access this page.</h4>
              <h4>
                <Link to={routes.SIGN_IN}>Sign In</Link>
              </h4>
            </div>
          )}
        </React.Fragment>
      );
    }
  }
  withCorrectAccountComponent.propTypes = {
    recipes: PropTypes.instanceOf(Array),
    user: PropTypes.string,
    match: PropTypes.object,
  };
  return withRouter(withCorrectAccountComponent);
};

export default withCorrectAccount;
withCorrectAccount.propTypes = {
  Component: PropTypes.element,
};
