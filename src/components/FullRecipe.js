import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'

function FullRecipe(props){

      const recipes = props.recipes;
      const title = props.match.params.title;

      const rec = recipes.filter(rec => {
          if(rec.title.split(' ').join('') === title) {
              return rec;
          }})
      console.log(rec);

      const List = rec.map((recipe) => {
        return (
          <div key={recipe.id} className="fullRecipe">
              <Link to={'/'}><h2>Back</h2></Link>

                <div className="topContainer">

                  <div className="fullImage" style= { {
                      backgroundImage:
                      `url(${recipe.imageURL })` } }>
                  </div>
                  <div className="titleBox">
                    <h1>{recipe.title}</h1>
                    <h2><span>Category</span><span className="catName">{recipe.category}</span></h2>
                  </div>
                </div>
                  <div className="ingredientContainer">
                      <h2>Ingredients</h2>
                      <div className="fullIngredientList">
                      {recipe.ingredients.map(ingredient =>
                        <p key = {ingredient.id}>{ingredient.text}</p>
                      )}
                      </div>
                  </div>

                <div  className="methodContainer">
                    <h2>Steps</h2>
                    {recipe.steps.map((step, index) =>
                      <p key = {step.id}><span>{index + 1}.</span> {step.text}</p>
                    )}
                </div>
          </div>
        )
    })
    return (
      <div className="wrapper">
      {List}
      </div>
    )

}
FullRecipe.propTypes = {
  recipes: PropTypes.array,
  title: PropTypes.object,
  recipe: PropTypes.arrayOf(PropTypes.string)
}
export default FullRecipe;

// const name = rec.map(r => r.title);
//       const Ingredients = rec.map(r => r.ingred.map(food =>
//           <p key = {food.id}>{food.text}</p>
//         )
//       )
//       const steps = rec.map(r => r.steps);
//       console.log(name);




 // const recipes = this.props.recipes;
 //      const title = this.props.match.params.title;
 //      function Search (id) {
 //        const isRecipe = r => r.title === id
 //        return recipes.find(isRecipe)
 //      }
 //      const rec = recipes.Search(title);



// function get (recipe) {
//     const isRecipe = r => r.title === recipe
//     return {props.recipes.find(isRecipe)}
//   }
//     const recipe = get(props.match.params.title);
//         if (!recipe) {
//           return <div>Sorry, but the recipe was not found</div>
//         }