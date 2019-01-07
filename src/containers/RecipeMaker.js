import React, { Component } from 'react';
import PropTypes from 'prop-types';
import firebase from '../firebase/firebase';
import RecipeForm from '../components/RecipeForm';
import AuthUserContext from '../components/AuthUserContext';
import DisplayUI from '../components/DisplayUI';
import CategoryAPI from '../categories';
import Menu from '../icons/Menu';
import Remove from '../icons/Remove';

class RecipeMaker extends Component {
  constructor() {
    super();
    this.state = {
      // user: null,
      collapse: true,
      sideBar: false,
      // filtering of recipe items
      filtered: false,
      dateChange: false,
      titleChange: false,
      displayCategory: CategoryAPI.all(),
      categoryChecked: false,
      sorted: false,
      sorting: 'none',
      userFilter: 'none',
      timeCookFilter: 'none',
      // remove recipe items
      isModalOpen: false,
      removeID: '',
    };
    this.toggleCollapse = this.toggleCollapse.bind(this);
    this.handleAllChecked = this.handleAllChecked.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.toggleCategoryButtons = this.toggleCategoryButtons.bind(this);
    this.toggleDate = this.toggleDate.bind(this);
    this.toggleTitle = this.toggleTitle.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.removeRecipe = this.removeRecipe.bind(this);
  }

  removeRecipe = recipeId => {
    const recipeRef = firebase.database().ref(`/recipes/${recipeId}`);
    recipeRef.remove();
  };

  toggleCollapse() {
    const { collapse } = this.state;
    this.setState({ collapse: !collapse });
  }

  toggleModal(id) {
    const { isModalOpen } = this.state;
    this.setState({ removeID: id });
    this.setState({ isModalOpen: !isModalOpen });
  }

  toggleSidebar() {
    const { sideBar } = this.state;
    this.setState({ sideBar: !sideBar });
  }

  toggleCategoryButtons() {
    const { filtered } = this.state;
    this.setState({
      filtered: !filtered,
    });
  }

  toggleDate() {
    const { dateChange } = this.state;
    this.setState({
      dateChange: !dateChange,
    });
  }

  toggleTitle() {
    const { titleChange } = this.state;
    this.setState({
      titleChange: !titleChange,
    });
  }

  handleAllChecked() {
    const { displayCategory } = this.state;
    for (const item of displayCategory) {
      item.isChecked = false;
    }
    this.setState({ displayCategory });
    this.setState({ categoryChecked: false });
  }

  handleCheck(event) {
    const { displayCategory } = this.state;
    displayCategory.forEach(category => {
      if (category.text === event.target.value)
        category.isChecked = event.target.checked;
    });
    this.setState({ displayCategory });
    const checked = displayCategory.find(obj => obj.isChecked === true);
    if (checked) {
      this.setState({ categoryChecked: true });
    } else {
      this.setState({ categoryChecked: false });
    }
  }

  handleSort(name) {
    // this.setState({ sorted: true })
    this.setState({ sorting: name });
  }

  handleFilter(state, name) {
    this.setState({ [state]: name });
  }

  deselectFilters() {
    const { sorted, categoryChecked } = this.state;
    this.setState({ sorted: !sorted });
    this.setState({ categoryChecked: !categoryChecked });
  }

  render() {
    const {
      collapse,
      sideBar,
      displayCategory,
      categoryChecked,
      filtered,
      removeID,
      isModalOpen,
      checkedItems,
      userChecked,
      sorted,
      sorting,
      userFilter,
      timeCookFilter,
    } = this.state;
    const { loadingUser, user, authUser, recipes, loading } = this.props;
    return (
      <React.Fragment>
        <section className="container-bg">
          <RecipeForm
            toggleCollapse={this.toggleCollapse}
            collapse={collapse}
            {...this.props}
          />
        </section>
        <section id="top-bar">
          <div className="browse">
            <span
              role="button"
              tabIndex={0}
              onKeyDown={this.toggleSidebar}
              onClick={this.toggleSidebar}
            >
              {sideBar ? <Remove color="#273762" /> : <Menu color="#273762" />}
            </span>
            <h3>Browse Recipes</h3>
          </div>
          <AuthUserContext.Consumer>
            {authUser =>
              authUser && (
                <div className="topBarAccount">
                  <h4>Account</h4>
                  <h4>
                    {loadingUser && 'loading ...'}
                    {user}
                  </h4>
                </div>
              )
            }
          </AuthUserContext.Consumer>
          {/* { !!users && <UserInfo users={this.props.users} newUser={this.newUser} /> } */}
        </section>
        <section className="display-recipes">
          <DisplayUI
            user={user}
            recipes={recipes}
            authUser={authUser}
            loading={loading}
            setCategory={this.setCategory}
            displayCategory={displayCategory}
            filtered={filtered}
            handleAllChecked={this.handleAllChecked}
            handleCheck={this.handleCheck}
            toggleCategoryButtons={this.toggleCategoryButtons}
            toggleCheckbox={this.toggleCheckbox}
            removeID={removeID}
            removeRecipe={this.removeRecipe}
            isModalOpen={isModalOpen}
            toggleModal={this.toggleModal}
            toggleTitle={this.toggleTitle}
            categoryChecked={categoryChecked}
            checkedItems={checkedItems}
            userChecked={userChecked}
            sorted={sorted}
            sorting={sorting}
            handleSort={this.handleSort}
            handleFilter={this.handleFilter}
            userFilter={userFilter}
            timeCookFilter={timeCookFilter}
            toggleSidebar={this.toggleSidebar}
            sideBar={sideBar}
          />
        </section>
      </React.Fragment>
    );
  }
}

export default RecipeMaker;
RecipeMaker.propTypes = {
  user: PropTypes.string,
  toggleDate: PropTypes.func,
  dateChange: PropTypes.bool,
  toggleCategoryButtons: PropTypes.func,
  filtered: PropTypes.bool,
  selectedCat: PropTypes.string,
};
