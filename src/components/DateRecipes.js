import React from 'react';
import PropTypes from 'prop-types';
import RecipeItem from './RecipeItem'

function DateRecipes (props) {
		const sortRecipes = props.recipes.sort((a, b) => {
			return parseFloat(a.time) - parseFloat(b.time);
		})
  	return (
      <ul>
				{sortRecipes.map((recipe, index) =>
						<RecipeItem key={index} recipe={recipe} isModalOpen={props.isModalOpen}
						user={props.user} openModal={props.openModal} closeModal={props.closeModal}
						removeID={props.removeID} removeItem={props.removeItem} />
					)
				}
			</ul>
    )


}
DateRecipes.PropTypes = {
	recipes: PropTypes.arrayOf(PropTypes.string),
	isModalOpen: PropTypes.bool,
	user: PropTypes.object,
	openModal: PropTypes.func,
    removeID: PropTypes.string,
    removeItem: PropTypes.func,
    closeModal: PropTypes.func
}
export default DateRecipes;
