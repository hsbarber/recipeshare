import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import AuthUserContext from './AuthUserContext';
import { auth } from '../firebase/firebase';
import * as routes from '../constants/routes';

const withCorrectAccount = Component => {
  class withCorrectAccountComponent extends React.Component {
    constructor() {
      super();
      this.state = {
        pending: true,
        recipe: false,
      };
    }

    componentDidMount() {
      const { recipes, user, match } = this.props;
      const { title } = match.params;
      const findRecipe = recipes.filter(recipe =>
        recipe.user === user ? recipe : null
      );
      console.log(findRecipe);
      const recipeTitles = findRecipe.map(rec => rec.title.split(' ').join(''));
      recipeTitles.indexOf(title) >= 0
        ? this.setState({ recipe: true })
        : this.setState({ recipe: false });
    }

    render() {
      const { recipes, user, match } = this.props;

      const { pending, recipe } = this.state;

      return (
        <React.Fragment>
          {recipe ? (
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
