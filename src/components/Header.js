import React from 'react';
import { Link } from 'react-router-dom'
import RecipeIcon from '../icons/RecipeIcon';
 function Header() {
	return (
		<header>
			<Link to={'/'}>
				<RecipeIcon />
				<h3>Recipe Share</h3>
			</Link>
		</header>
	)
}

export default Header;