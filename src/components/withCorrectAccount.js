import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import * as routes from '../constants/routes';

const withCorrectAccount = Component => {
  class withCorrectAccountComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        recipesCopy: JSON.parse(localStorage.getItem('recipes')),
        editRecipe: [],
      };
    }

    componentDidMount() {
      const { match } = this.props;
      const { recipesCopy } = this.state;
      const { title } = match.params;
      // filter recipesCopy array (which is pulled from local storage)
      // to only be the array with same title as router title
      const findRecipe = recipesCopy.filter(recipe =>
        recipe.title.replace(/\s/g, '') === title ? recipe : null
      );

      // create a deep copy  of the findRecipe array
      const newRecipe = JSON.parse(JSON.stringify(findRecipe));
      // set state of editRecipe to recipe that matches the title of router title
      this.setState({
        editRecipe: newRecipe,
      });
    }

    render() {
      const { user, match } = this.props;
      const { title } = match.params;
      const { recipesCopy } = this.state;
      // need to check if user is allowed access to recipe based on if they created recipe
      // filter recipesCopy array (which is pulled from local storage)
      // to only be the arrays created by the current user
      const userRecipes = recipesCopy.filter(recipe =>
        recipe.user === user ? recipe : null
      );
      // map over the userRecipes array to only output the titles in the array
      const recipeTitles = userRecipes.map(rec =>
        rec.title.split(' ').join('')
      );
      const { editRecipe } = this.state;
      return (
        <React.Fragment>
          {/* This conditional checks if the recipeTitles array contains the router title,
          /* ensuring the user is allowed to edit the recipe */}
          {recipeTitles.indexOf(title) >= 0 ? (
            <Component {...this.props} editRecipe={editRecipe} />
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
