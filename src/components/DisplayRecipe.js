import React from 'react';
import PropTypes from 'prop-types';
import RecipeItem from './RecipeItem'

function DisplayRecipe (props) {
	const sortRecipes = props.recipes.sort((a, b) => {
		return parseFloat(b.time) - parseFloat(a.time);
	});
	return (
		<ul>
			{sortRecipes.map((recipe, index) =>
					<RecipeItem {...props} key={index} recipe={recipe} />
				)
			}
		</ul>
	)

}
DisplayRecipe.propTypes = {
	recipes: PropTypes.array,
	isModalOpen: PropTypes.bool,
	user: PropTypes.object,
	openModal: PropTypes.func,
    removeID: PropTypes.string,
    removeItem: PropTypes.func,
    closeModal: PropTypes.func
}

export default DisplayRecipe;
