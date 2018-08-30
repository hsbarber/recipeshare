import React from 'react'
import CategoryButtons from './CategoryButtons'
import RecipeItem from './RecipeItem'
import ChevronDown from '../icons/ChevronDown.js';
import Remove from '../icons/Remove.js';
import AnimateHeight from 'react-animate-height';

function DisplayUI (props) {
  const filteredCategories = props.displayCategory.filter(item => item.checked);
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
  if (props.categoryChecked){
    recipes = recipes.filter(recipe =>  filteredText.indexOf(recipe.category) > -1);
  }
  if (props.userFilter != "none") {
    recipes = recipes.filter(recipe => recipe.user === props.userFilter);
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
                    <CategoryButtons displayCategory={props.displayCategory} handleFilter={props.handleFilter} />
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
              <h4 className="sort">Sort by User</h4>
              <select
                  className="user-filter"
                  onChange={(e) => props.filterUsers(e.target.value)}
                >
                  <option value="none">none</option>
                  {users}
              </select>
            </div>
    </div>
    <ul className="recipe-list">
      {recipes.map((recipe, index) =>

        <RecipeItem
          key={index}
          recipe={recipe}
          {...props}
        />
      )}
		</ul>

  </React.Fragment>
  )
}

export default DisplayUI;