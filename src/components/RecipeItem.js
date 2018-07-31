import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'

function RecipeItem(props) {
    const NoImage = "http://i63.tinypic.com/2j8tpy.png";
    const {id, title, imageURL, category, user} = props.recipe;
    return (
        <li key={id}>
            <Link to={`/${title.split(' ').join('')}`}>
            <div className="bgImage" style= { {
                backgroundImage:
                `url(${imageURL})` } }>
            </div>
            <h3 className="category">{category}</h3>
            <div className="title-block"><h3>{title}</h3><h3>{user}</h3></div>
            </Link>
            {user === props.user.email ?
                <button className="remove" onClick={() => props.openModal(id)}>Remove Recipe </button>
              : null}
            {props.isModalOpen && props.recipe.id === props.removeID &&
                 <div className="deleteDrop">
                     <p>Are you sure you want to Delete?</p>
                     <p className="deleteButtons"><button onClick={() => props.removeItem(props.recipe.id)}>Delete</button>
                     <button onClick={() => props.closeModal()}>Close</button></p>
                 </div>
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