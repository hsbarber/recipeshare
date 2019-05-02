import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import AnimateHeight from 'react-animate-height';
import ChevronDown from '../icons/ChevronDown';

function RecipeItem(props) {
  const { toggleModal, removeID, removeRecipe, recipe, user } = props;
  // console.log(recipe);
  return (
    <li key={recipe.id}>
      <Link to={`/${recipe.title.split(' ').join('')}`}>
        {recipe.imageURL ? (
          <div
            className="bgImage"
            style={{
              backgroundImage: `url(${recipe.imageURL})`,
            }}
          />
        ) : (
          <div
            className="bgImage"
            style={{
              backgroundColor: `#627bc0`,
            }}
          >
            <h4>No Image Available</h4>
          </div>
        )}
        <h3 className="category">{recipe.category}</h3>
        <div className="title-block">
          <h3 className="title">{recipe.title}</h3>
          {recipe.user && (
            <h4>
              by<span>{recipe.user}</span>
            </h4>
          )}
        </div>
      </Link>
      {recipe.user
        ? recipe.user === user && (
            <button
              className="remove"
              type="button"
              onClick={() => toggleModal(recipe.id)}
            >
              Remove Recipe{' '}
              {removeID[recipe.id] ? (
                <span className="down">
                  <ChevronDown color="#273762" />
                </span>
              ) : (
                <span className="up">
                  <ChevronDown color="#273762" />
                </span>
              )}{' '}
            </button>
          )
        : ''}

      {removeID[recipe.id] && (
        <AnimateHeight
          className="dropDown"
          duration={500}
          height={removeID[recipe.id] ? 'auto' : 0}
        >
          <div className="deleteDrop">
            <p>Are you sure you want to Delete?</p>
            <p className="deleteButtons">
              <button type="button" onClick={() => removeRecipe(recipe.id)}>
                Delete
              </button>
              <button
                type="button"
                className="closeModal"
                onClick={() => toggleModal(recipe.id)}
              >
                Close
              </button>
            </p>
          </div>
        </AnimateHeight>
      )}
    </li>
  );
}

export default RecipeItem;

RecipeItem.propTypes = {
  recipe: PropTypes.object,
  user: PropTypes.string,
  removeID: PropTypes.object,
  removeRecipe: PropTypes.func,
  toggleModal: PropTypes.func,
};
