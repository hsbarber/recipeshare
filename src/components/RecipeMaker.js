import React from 'react';
import RecipeForm from './RecipeForm.js';
import DisplayRecipe from './DisplayRecipe.js';
import CategoryButtons from './CategoryButtons.js';
import CategoryRecipes from './CategoryRecipes.js';
import DateRecipes from './DateRecipes.js';

function RecipeMaker(props) {
    return (
      <div className='app'>

          {props.user ?
          <div>
            <div className='container'>
              <div className="logged-in-as"><p>Logged in as - {props.user.displayName || props.user.email}</p> </div>
              <button className="logIn-Out" onClick={props.logout}>Log Out</button>
              <div className='user-profile'>
                <img src={props.user.photoURL} />
              </div>
              <div className="formWrapper">
                <RecipeForm {...props}/>
              </div>
            </div>
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

export default RecipeMaker;




