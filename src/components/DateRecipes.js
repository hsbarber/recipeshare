import React from 'react';
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

export default DateRecipes;
