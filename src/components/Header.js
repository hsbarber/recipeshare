import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import AuthUserContext from './AuthUserContext';
import * as routes from '../constants/routes';
import RecipeIcon from '../icons/RecipeIcon';
import SignOutButton from './SignOut';

const Header = ({ changeUser }) => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? (
          <NavigationAuth changeUser={changeUser} />
        ) : (
          <NavigationNonAuth />
        )
      }
    </AuthUserContext.Consumer>
  </div>
);
const Logo = () => (
  <Link to="/">
    <RecipeIcon />
    <h3>Recipe Share</h3>
  </Link>
);
const NavigationAuth = ({ changeUser }) => (
  <header>
    <Logo />
    <ul>
      <li>
        <Link to={routes.ACCOUNT}>Account</Link>
      </li>
      <li>
        <SignOutButton changeUser={changeUser} />
      </li>
    </ul>
  </header>
);
NavigationAuth.propTypes = {
  changeUser: PropTypes.func,
};
const NavigationNonAuth = () => (
  <header>
    <Logo />
    <ul>
      <li>
        <Link to={routes.SIGN_IN}>Sign In</Link>
      </li>
    </ul>
  </header>
);

export default Header;

Header.propTypes = {
  changeUser: PropTypes.func,
};
