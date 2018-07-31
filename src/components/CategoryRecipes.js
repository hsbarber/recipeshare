import React from 'react';
import PropTypes from 'prop-types';
import RecipeItem from './RecipeItem'

function CategoryRecipes (props) {

	const filterByCategory = props.recipes.filter(rec => {
	    if(rec.category.toLowerCase() === props.selectedCat.toLowerCase()) {
	        return rec;
	    }
	})

  	return (
  		<ul>
		{filterByCategory[0] === undefined ?
			<h4> No results for this category</h4> :
			filterByCategory.map((recipe, index) =>
				<RecipeItem key={index} recipe={recipe} {...props} />
			)
		}
  		</ul>
  	)
}
CategoryRecipes.propTypes = {
	recipes: PropTypes.arrayOf(PropTypes.string),
	selectedCat: PropTypes.string,
	isModalOpen: PropTypes.bool,
	user: PropTypes.object,
	openModal: PropTypes.func,
	closeModal: PropTypes.func,
	removeID: PropTypes.string,
	removeItem: PropTypes.func
}
export default CategoryRecipes;
