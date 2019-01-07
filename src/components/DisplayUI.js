import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AnimateHeight from 'react-animate-height';
import CategoryButtons from './CategoryButtons';
import RecipeItem from './RecipeItem';
import ChevronDown from '../icons/ChevronDown.js';
import Remove from '../icons/Remove.js';

class DisplayUI extends Component {
  render() {
    const {
      displayCategory,
      recipes,
      sorting,
      categoryChecked,
      userFilter,
      timeCookFilter,
      sideBar,
      toggleCategoryButtons,
      filtered,
      handleAllChecked,
      handleCheck,
      handleSort,
      handleFilter,
      loading,
      user,
    } = this.props;
    const filteredCategories = displayCategory.filter(item => item.isChecked);
    const filteredText = filteredCategories.map(item => item.text);
    const userList = recipes.map(recipe => recipe.user);

    const uniqueList = [...new Set(userList)];

    const users = uniqueList.map((item, index) => (
      <option key={index} value={item}>
        {item}
      </option>
    ));
    let recipesCopy = recipes.slice();
    if (sorting) {
      recipesCopy = recipesCopy.sort((a, b) => {
        switch (sorting) {
          case 'latest-oldest':
            return b.time - a.time;
          case 'oldest-latest':
            return a.time - b.time;
          case 'A-Z':
            return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
          case 'Z-A':
            return b.title.toLowerCase().localeCompare(a.title.toLowerCase());
          default:
            return b.time - a.time;
        }
      });
    }
    let noRecipes = false;
    if (categoryChecked) {
      const categoryRecipes = recipesCopy.filter(
        recipe => filteredText.indexOf(recipe.category) > -1
      );

      if (!Array.isArray(categoryRecipes) || !categoryRecipes.length) {
        noRecipes = true;
      } else {
        recipesCopy = categoryRecipes;
        noRecipes = false;
      }
    }
    const notChecked = recipesCopy;
    if (categoryChecked === false) {
      recipesCopy = notChecked;
    }
    if (userFilter !== 'none') {
      recipesCopy = recipesCopy.filter(recipe => recipe.user === userFilter);
    }
    if (timeCookFilter !== 'none') {
      recipesCopy = recipesCopy.filter(
        recipe => recipe.recipeTime === timeCookFilter
      );
    }
    return (
      <React.Fragment>
        <div id="sidebar" className={sideBar ? 'sb-open' : 'sb-close'}>
          <div className="option">
            <button
              type="button"
              className="category"
              onClick={toggleCategoryButtons}
            >
              {filtered ? (
                <div>
                  <h4>Close</h4>
                  <Remove color="#abb8dd" />
                </div>
              ) : (
                <div>
                  <h4>Filter by Category</h4>
                  <ChevronDown color="#abb8dd" />
                </div>
              )}
            </button>
            <AnimateHeight duration={500} height={filtered ? 'auto' : 0}>
              <CategoryButtons
                handleAllChecked={handleAllChecked}
                displayCategory={displayCategory}
                handleCheck={handleCheck}
                categoryChecked={categoryChecked}
              />
            </AnimateHeight>
          </div>
          <div className="option">
            <h4 className="sort">Sort by Title </h4>
            <select
              className="title-filter"
              onChange={e => handleSort(e.target.value)}
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
              onChange={e => handleSort(e.target.value)}
            >
              <option value="none">none</option>
              <option value="latest-oldest">latest to oldest</option>
              <option value="oldest-latest">oldest to latest</option>
            </select>
          </div>
          <div className="option">
            <h4 className="sort">Sort by Time to Make</h4>
            <select
              className="date-filter"
              onChange={e => handleFilter('timeCookFilter', e.target.value)}
            >
              <option value="none">none</option>
              <option value="Short - less than 1 hour">
                Short - less than 1 hour
              </option>
              <option value="Average - less than 2 hours">
                Average - less than 2 hours
              </option>
              <option value="Long - over 2 hours">Long - over 2 hours</option>
            </select>
          </div>
          <div className="option">
            <h4 className="sort">Sort by User</h4>
            <select
              className="user-filter"
              onChange={e => handleFilter('userFilter', e.target.value)}
            >
              <option value="none">none</option>
              {users}
            </select>
          </div>
        </div>
        <ul className="recipe-list">
          {loading && <h4 className="loading">loading ...</h4>}
          {noRecipes ? (
            <h4>there are no recipes for this category or categories</h4>
          ) : (
            recipesCopy.map((recipe, index) => (
              <RecipeItem
                key={index}
                recipe={recipe}
                user={user}
                {...this.props}
              />
            ))
          )}
        </ul>
      </React.Fragment>
    );
  }
}

export default DisplayUI;

DisplayUI.propTypes = {
  displayCategory: PropTypes.instanceOf(Array),
  recipes: PropTypes.instanceOf(Array),
  sorting: PropTypes.string,
  userFilter: PropTypes.string,
  timeCookFilter: PropTypes.string,
  sideBar: PropTypes.bool,
  toggleCategoryButtons: PropTypes.func,
  filtered: PropTypes.bool,
  handleAllChecked: PropTypes.func,
  handleCheck: PropTypes.func,
  categoryChecked: PropTypes.bool,
  handleSort: PropTypes.func,
  handleFilter: PropTypes.func,
  loading: PropTypes.bool,
  user: PropTypes.string,
};
