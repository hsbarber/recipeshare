import React from 'react';
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
				<RecipeItem key={index} recipe={recipe} isModalOpen={props.isModalOpen}
				user={props.user} openModal={props.openModal} closeModal={props.closeModal} removeID={props.removeID}
				removeItem={props.removeItem} />
			)
		}
  		</ul>
  	)
}

export default CategoryRecipes;
