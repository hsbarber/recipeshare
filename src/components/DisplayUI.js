import React from 'react'
import CategoryButtons from './CategoryButtons'
import RecipeItem from './RecipeItem'
import ChevronDown from '../icons/ChevronDown.js';
import Remove from '../icons/Remove.js';
import AnimateHeight from 'react-animate-height';

function DisplayUI (props) {
  const filteredCategories = props.displayCategory.filter(item => item.isChecked);
  const filteredText = filteredCategories.map(item => item.text);

  let userList = props.recipes.map(recipe =>
      recipe.user
  );

  const uniqueList = [...new Set(userList)];

  const users = uniqueList.map((item, index) =>
      <option key={index} value={item}>
        {item}
      </option>
  )
  let recipes = props.recipes.slice();
  if(props.sorting) {
      recipes = recipes.sort((a, b) => {
        switch(props.sorting) {
          case 'latest-oldest':
            return b.time - a.time;
          case 'oldest-latest':
            return a.time - b.time;
          case 'A-Z':
            return a.title.toLowerCase() > b.title.toLowerCase() ? 1
            : a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 0
          case 'Z-A':
            return a.title.toLowerCase() < b.title.toLowerCase() ? 1
            : a.title.toLowerCase() > b.title.toLowerCase() ? -1 : 0;
          case 'none':
            return b.time - a.time;
        }
      });
  }
  let noRecipes = false;
  if (props.categoryChecked){
    let newrecipes = recipes.filter(recipe =>
     filteredText.indexOf(recipe.category) > -1 )
     if (!Array.isArray(newrecipes) || !newrecipes.length) {
      noRecipes = true;
     } else {
      recipes = newrecipes
      noRecipes = false;
     }
  }
  if (props.categoryChecked === false) {
    recipes = recipes;
  }
  if (props.userFilter != "none") {
    recipes = recipes.filter(recipe => recipe.user === props.userFilter);
  }
  if (props.timeCookFilter != "none") {
    recipes = recipes.filter(recipe => recipe.recipeTime === props.timeCookFilter);
  }
  return (
  <React.Fragment>

        <div id="sidebar" className={props.sideBar ? "sb-open" : "sb-close"}>
            <div className="option" >
              <h4 className="category" onClick={props.toggleCategoryButtons}>{props.filtered ? <div>Close <Remove color="#abb8dd"/></div> : <div>Filter by Category <ChevronDown color="#abb8dd"/></div>}</h4>
              <AnimateHeight
                  duration={ 500 }
                  height={props.filtered ? 'auto' : 0}
              >
                <CategoryButtons
                  handleAllChecked={props.handleAllChecked}
                  displayCategory={props.displayCategory}
                  handleCheck={props.handleCheck}
                  categoryChecked={props.categoryChecked}
                />
              </AnimateHeight>
            </div>
            <div className="option">
              <h4 className="sort">Sort by Title </h4>
              <select
                  className="title-filter"
                  onChange={(e) => props.handleSort(e.target.value)}
                >
                  <option value="none">none</option>
                  <option value="A-Z">A-Z</option>
                  <option value="Z-A">Z-A</option>
              </select>
            </div>
            <div className="option">
              <h4 className="sort">Sort by Date</h4>
              <select
                  className="date-filter"
                  onChange={(e) => props.handleSort(e.target.value)}
                >
                  <option value="none" >none</option>
                  <option value="latest-oldest">latest to oldest</option>
                  <option value="oldest-latest">oldest to latest</option>
              </select>
            </div>
            <div className="option">
              <h4 className="sort">Sort by Time to Make</h4>
              <select
                  className="date-filter"
                  onChange={(e) => props.handleFilter('timeCookFilter', e.target.value)}
                >
                  <option value="none" >none</option>
                  <option value="Short - less than 1 hour">Short - less than 1 hour</option>
                  <option value="Average - less than 2 hours">Average - less than 2 hours</option>
                  <option value="Long - over 2 hours">Long - over 2 hours</option>
              </select>
            </div>
            <div className="option">
              <h4 className="sort">Sort by User</h4>
              <select
                  className="user-filter"
                  onChange={(e) => props.handleFilter('userFilter', e.target.value)}
                >
                  <option value="none">none</option>
                  {users}
              </select>
            </div>
    </div>
    <ul className="recipe-list">
      {props.loading && <h4 className="loading">loading ...</h4>}
      {noRecipes ? <h4>there are no recipes for this category or categories</h4> :
        recipes.map((recipe, index) =>
          <RecipeItem
            key={index}
            recipe={recipe}
            user={props.user}
            {...props}
          />
      )}

		</ul>

  </React.Fragment>
  )
}

export default DisplayUI;