import React from 'react';
import { Link } from 'react-router-dom'

function RecipeItem(props) {
    const NoImage = "http://i63.tinypic.com/2j8tpy.png";
    // const recipe = props.recipe;
    return (
        <li key={props.recipe.id}>
            <Link to={`/${props.recipe.title.split(' ').join('')}`}>
            <div className="bgImage" style= { {
                backgroundImage:
                `url(${props.recipe.image})` } }>
            </div>
            <h3 className="category">{props.recipe.category}</h3>
            <h3 className="title-block">{props.recipe.title}</h3>
            </Link>
            {props.recipe.user === props.user.email ?
                <button className="remove" onClick={() => props.openModal(props.recipe.id)}>Remove Recipe </button>
             : null}
            {props.isModalOpen && props.recipe.id === props.removeID ?
                <div className="deleteDrop">
                    <p>Are you sure you want to Delete?</p>
                    <p className="deleteButtons"><button onClick={() => props.removeItem(props.recipe.id)}>Delete</button>
                    <button onClick={() => props.closeModal()}>Close</button></p>
                </div>
                : ''
            }
        </li>
    )
}

export default RecipeItem;
// backgroundImage:
// `url(${props.recipe.image === undefined ? NoImage : props.recipe.image })` } }>
// style= { {
//     backgroundImage:
//      `url(${props.recipe.image === undefined ? NoImage : props.recipe.image })` } }