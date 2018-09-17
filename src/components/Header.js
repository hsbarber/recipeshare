import React from 'react';
import { Link } from 'react-router-dom'
import AuthUserContext from './AuthUserContext';
import * as routes from '../constants/routes';
import RecipeIcon from '../icons/RecipeIcon';
import SignOutButton from './SignOut';

const Header = () =>
 	<div>
    <AuthUserContext.Consumer>
    {authUser => authUser
      ? <NavigationAuth />
      : <NavigationNonAuth />
    }
  </AuthUserContext.Consumer>
  </div>
const Logo = () =>
	<Link to={'/'}>
			<RecipeIcon />
			<h3>Recipe Share</h3>
	</Link>


const NavigationAuth = (props) =>
	<header>
		<Logo />
		<ul>
			<li><Link to={routes.HOME}>Home</Link></li>
			<li><Link to={routes.ACCOUNT}>Account</Link></li>
			<li><SignOutButton /></li>
		</ul>
	</header>

const NavigationNonAuth = () =>
	<header>
		<Logo />
		<ul>
			<li><Link to={routes.SIGN_IN}>Sign In</Link></li>
		</ul>
	</header>

export default Header;