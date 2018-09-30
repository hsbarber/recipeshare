import React from 'react';
import PropTypes from 'prop-types';
import AuthUserContext from '../components/AuthUserContext';
import Edit from './Edit';

function FullRecipe(props){

      const recipes = props.recipes;
      const title = props.match.params.title;

      const rec = recipes.filter(rec => {
        if(rec.title.split(' ').join('') === title) {
            return rec;
        }});

        const List = rec.map((recipe) => {
          return (
            props.canEdit & props.editable === recipe.id ?
              <Edit {...props} />
              :
                      <div key={recipe.id}>
                      <AuthUserContext.Consumer>
                        {(authUser) => authUser.email === recipe.email && <button className="fullRecipe--edit" onClick={() => props.getRecipe(recipe.id)}>Edit</button>}
                      </AuthUserContext.Consumer>
                        {/* <Link to={routes.EDIT}><button className="fullRecipe--edit" onClick={() => props.getRecipe(recipe.id)}>Edit</button></Link> */}
                        <div  className="fullRecipe">


                              <div className="fullRecipe--tBlock">
                                <div className="fullRecipe--tBlock-box">
                                  <div className="titleBox">
                                    <h3>{recipe.title}</h3>
                                    <p><span>Category</span><span>{recipe.category}</span></p>
                                    {recipe.recipeTime && <p><span>Time to Cook</span><span>{recipe.recipeTime}</span></p>}
                                    {recipe.link && <a href={recipe.link}>Link to Original Recipe</a>}
                                    <p>{recipe.notes}</p>
                                  </div>
                                </div>
                                {recipe.imageURL ?
                                  <div className="fullRecipe--tBlock-image" style= { {
                                    backgroundImage:
                                    `url(${recipe.imageURL })` } }>
                                  </div>
                                  :
                                  <div className="fullRecipe--tBlock-image" style= { {
                                    backgroundColor:
                                    `#627bc0` } }>
                                      <h3>No Image Available</h3>
                                  </div>
                              }
                              </div>


                              <div  className="fullRecipe--bBlock">
                                  <div className="fullRecipe--bBlock-ingredients">
                                    <h3>Ingredients</h3>
                                    {recipe.ingredients.map(ingredient =>
                                      <p key = {ingredient.id}>{ingredient.content}</p>
                                    )}
                                  </div>
                                  <div className="fullRecipe--bBlock-steps">
                                    <h3>Steps</h3>
                                    {recipe.steps.map((step, index) =>
                                      <p key = {step.id}><span>{index + 1}.</span> {step.content}</p>
                                    )}
                                  </div>
                              </div>
                        </div>
                      </div>

        )
    })
    return (

      <React.Fragment>

          {List}

      </React.Fragment>
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