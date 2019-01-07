import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Transition } from 'react-spring';
import AuthUserContext from './AuthUserContext';

function FullRecipe(props) {
  const { recipes, match } = props;
  const { title } = match.params;
  const recipeDisplay = recipes.filter(recipe =>
    recipe.title.replace(/\s/g, '') === title ? recipe : null
  );
  const List = recipeDisplay.map(recipe => (
    <div key={recipe.id}>
      <div className="fullRecipe">
        <div className="fullRecipe--tBlock">
          <div className="fullRecipe--tBlock-box">
            <div className="titleBox">
              <h3>{recipe.title}</h3>
              <p>
                <span>Category</span>
                <span>{recipe.category}</span>
              </p>
              {recipe.recipeTime && (
                <p>
                  <span>Time to Cook</span>
                  <span>{recipe.recipeTime}</span>
                </p>
              )}
              {recipe.link && <a href={recipe.link}>Link to Original Recipe</a>}
              <p>{recipe.notes}</p>
              <AuthUserContext.Consumer>
                {authUser =>
                  authUser &&
                  props.user === recipe.user && (
                    <div className="fullRecipe--edit">
                      <Link to={`/${title.split(' ').join('')}-edit`}>
                        <button type="button">Edit</button>
                      </Link>
                    </div>
                  )
                }
              </AuthUserContext.Consumer>
            </div>
          </div>
          {recipe.imageURL ? (
            <div
              className="fullRecipe--tBlock-image"
              style={{ backgroundImage: `url(${recipe.imageURL})` }}
            />
          ) : (
            <div
              className="fullRecipe--tBlock-image"
              style={{ backgroundColor: '#627bc0' }}
            >
              <h3>No Image Available</h3>
            </div>
          )}
        </div>
        <div className="fullRecipe--bBlock">
          <div className="fullRecipe--bBlock-ingredients">
            <h3>Ingredients</h3>
            {recipe.ingredients.map(ingredient => (
              <p key={ingredient.id}>{ingredient.content}</p>
            ))}
          </div>
          <div className="fullRecipe--bBlock-steps">
            <h3>Steps</h3>
            {recipe.steps.map((step, index) => (
              <p key={step.id}>
                <span>{index + 1}.</span> {step.content}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  ));
  // return <div>{List}</div>;
  return (
    <Transition
      items={List}
      from={{ transform: 'translate3d(0,60px,0)', opacity: 0 }}
      enter={{ transform: 'translate3d(0,0px,0)', opacity: 1 }}
      leave={{ transform: 'translate3d(0,-60px,0)', opacity: 0 }}
    >
      {List => List && (props => <div style={props}>{List}</div>)}
    </Transition>
  );
}

export default FullRecipe;

FullRecipe.propTypes = {
  recipes: PropTypes.instanceOf(Array),
  user: PropTypes.string,
  match: PropTypes.object,
};
