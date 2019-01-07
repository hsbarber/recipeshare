import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import AnimateHeight from 'react-animate-height';
import ChevronDown from '../icons/ChevronDown';

function RecipeItem(props) {
  const {
    toggleModal,
    isModalOpen,
    removeID,
    removeRecipe,
    recipe,
    user,
  } = props;
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
              {isModalOpen && recipe.id === removeID ? (
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

      {recipe.id === removeID && (
        <AnimateHeight duration={500} height={isModalOpen ? 'auto' : 0}>
          <div className="deleteDrop">
            <p>Are you sure you want to Delete?</p>
            <p className="deleteButtons">
              <button type="button" onClick={() => removeRecipe(recipe.id)}>
                Delete
              </button>
              <button type="button" onClick={() => toggleModal(recipe.id)}>
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
  isModalOpen: PropTypes.bool,
  removeID: PropTypes.string,
  removeRecipe: PropTypes.func,
  toggleModal: PropTypes.func,
};
// backgroundImage:
// `url(${props.recipe.image === undefined ? NoImage : props.recipe.image })` } }>
// style= { {
//     backgroundImage:
//      `url(${props.recipe.image === undefined ? NoImage : props.recipe.image })` } }
