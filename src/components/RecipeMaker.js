import React from 'react';
import PropTypes from 'prop-types';
import RecipeForm from './RecipeForm.js';
import DisplayRecipe from './DisplayRecipe.js';
import CategoryButtons from './CategoryButtons.js';
import CategoryRecipes from './CategoryRecipes.js';
import DateRecipes from './DateRecipes.js';

function RecipeMaker(props) {
    return (
    <div className="app">
          {props.user ?
          <div>
            <section className="container">
              <div className="login">
                <div className="logged-in-as"><p>Logged in as - {props.user.displayName || props.user.email}</p> </div>
                <button className="logIn-Out" onClick={props.logout}>Log Out</button>
                <div className='user-profile'>
                  <img src={props.user.photoURL} />
                </div>
              </div>
              <div className="formWrapper">
                <RecipeForm {...props}/>
              </div>
            </section>
            <section className='display-recipes'>
                <div className="wrapper">
                  <div className="filter-wrapper">
                    <h3>Browse By: </h3>
                    <h3 className="date" onClick={props.toggleDate}>Date - {props.dateChange ? `Latest` : `Oldest`}</h3>
                    <h3 className="category" onClick={props.toggleCategoryButtons}>{props.filtered ? `Close ✕` : `Category`}</h3>
                  </div>
                </div>
                {props.filtered ? <CategoryButtons {...props}/> : '' }
                {props.selectedCat ?
                  <CategoryRecipes {...props}/> :
                  props.dateChange ? <DateRecipes {...props}/>
                  : <DisplayRecipe {...props}/>
                }
            </section>
          </div>
          : <div>
             <p>You must be logged in to see the Recipe Maker and list.</p>
             <button onClick={props.login}>Log In</button>
            </div>
           }
    </div>

      )
}
RecipeMaker.PropTypes = {
  user: PropTypes.shape({
      displayName: PropTypes.string,
      email: PropTypes.string,
      photoURL: PropTypes.string
  }),
  login: PropTypes.func,
  logout: PropTypes.func,
  toggleDate: PropTypes.func,
  dateChange: PropTypes.bool,
  toggleCategoryButtons: PropTypes.func,
  filtered: PropTypes.bool,
  selectedCat: PropTypes.string,
}
export default RecipeMaker;




