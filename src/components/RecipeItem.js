import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import AnimateHeight from 'react-animate-height';
import ChevronDown from '../icons/ChevronDown';

function RecipeItem(props) {
    const {id, title, imageURL, category, user} = props.recipe;
    return (
        <li key={id}>
            <Link to={`/${title.split(' ').join('')}`}>
            { imageURL ? <div className="bgImage" style= { {
                            backgroundImage:
                            `url(${imageURL})` } }>
                        </div>
                    :   <div className="bgImage" style= { {
                        backgroundColor:
                        `#627bc0` } }>
                          <h4>No Image Available</h4>
                        </div>
            }
            <h3 className="category">{category}</h3>
            <div className="title-block"><h3 className="title">{title}</h3><h3>{props.user.displayName}</h3></div>
            </Link>
            {user === props.user.email ?
                <p className="remove" onClick={() => props.toggleModal(id)}>Remove Recipe {props.isModalOpen && props.recipe.id === props.removeID ?
                     <span className="down"><ChevronDown color="#273762"/></span> : <span className="up"><ChevronDown  color="#273762"/></span>} </p>
              : null}


            {props.recipe.id === props.removeID &&
                <AnimateHeight
                    duration={ 500 }
                    height={props.isModalOpen ? "auto" : 0}
                >
                    <div className="deleteDrop">
                        <p>Are you sure you want to Delete?</p>
                        <p className="deleteButtons"><button onClick={() => props.removeRecipe(props.recipe.id)}>Delete</button>
                        <button onClick={() => props.toggleModal(id)}>Close</button></p>
                    </div>
                </AnimateHeight>
            }

        </li>
    )
}
RecipeItem.propTypes = {
    recipe: PropTypes.object,
    openModal: PropTypes.func,
    isModalOpen: PropTypes.bool,
    removeID: PropTypes.string,
    removeItem: PropTypes.func,
    closeModal: PropTypes.func
}
export default RecipeItem;
// backgroundImage:
// `url(${props.recipe.image === undefined ? NoImage : props.recipe.image })` } }>
// style= { {
//     backgroundImage:
//      `url(${props.recipe.image === undefined ? NoImage : props.recipe.image })` } }