import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { firebase } from '../firebase'
import RecipeForm from '../components/RecipeForm';
import UserInfo from '../components/userInfo';
import AuthUserContext from '../components/AuthUserContext';
import DisplayUI from '../components/DisplayUI';
import CategoryAPI from '../categories';
import Menu from '../icons/Menu';
import Remove from '../icons/Remove';
import RecipeIcon from '../icons/RecipeIcon';

const UserList = ({users}) =>
<div>
  {Object.keys(users).map(key =>
    <div key={key}>{users[key].username}</div>
  )}
</div>

class RecipeMaker extends Component {
  constructor() {
    super();
    this.state = {
    //user: null,
    collapse: true,
    sideBar: false,
    //filtering of recipe items
    selectedCat: '',
    filtered: false,
    dateChange: false,
    titleChange: false,
    displayCategory: CategoryAPI.all(),
    categoryChecked: false,
    sorted: false,
    sorting: 'none',
    userFilter: 'none',
    timeCookFilter: 'none',
    //remove recipe items
    isModalOpen: false,
		removeID: ''
    }
    this.toggleCollapse = this.toggleCollapse.bind(this);
    //this.handleFilter = this.handleFilter.bind(this);
    this.handleAllChecked = this.handleAllChecked.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.toggleCategoryButtons = this.toggleCategoryButtons.bind(this);
    this.toggleDate = this.toggleDate.bind(this);
    this.toggleTitle = this.toggleTitle.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);
   }

  toggleCollapse() {
		this.setState({collapse: !this.state.collapse});
  }
  toggleSidebar() {
    this.setState({sideBar: !this.state.sideBar});
  }
	toggleCategoryButtons() {
		this.setState({
			filtered: !this.state.filtered,
		});
	}
	toggleDate(name) {
		this.setState({
      dateChange: !this.state.dateChange,
      recipeDisplay: name
		});
  }
  toggleTitle() {
		this.setState({
			titleChange: !this.state.titleChange
		});
	}
	removeRecipe(recipeId) {
	    const recipeRef = firebase.database().ref(`/recipes/${recipeId}`);
	    recipeRef.remove();
	 }
	toggleModal(id) {
		this.setState({ removeID: id });
		this.setState({ isModalOpen: !this.state.isModalOpen });
	}
  // handleFilter(index, e) {
  //     let newItems = this.state.displayCategory.slice();
  //     newItems[index].checked = !newItems[index].checked
  //     let checked = this.state.displayCategory.find(function (obj) { return obj.checked === true; });
  //     checked ? this.setState({ categoryChecked: true }) : this.setState({ categoryChecked: false })
  //     this.setState({
  //       displayCategory: newItems,
  //     })
  // }
  handleAllChecked ()  {
    let checkedCategories = this.state.displayCategory;
    for (var item of checkedCategories) {
      item.isChecked = false;
    }
    this.setState({displayCategory: checkedCategories})
    this.setState({ categoryChecked: false })

  }
  handleCheck (event) {
    let checkedCategories = this.state.displayCategory;
    checkedCategories.forEach(category => {
       if (category.text === event.target.value)
       category.isChecked =  event.target.checked
    })
    this.setState({displayCategory: checkedCategories })
    let checked = this.state.displayCategory.find(function (obj) { return obj.isChecked === true; });
    checked ? this.setState({ categoryChecked: true }) : this.setState({ categoryChecked: false })
  }
  handleSort(name) {
    //this.setState({ sorted: true })
    this.setState({ sorting: name })
  }
  handleFilter(state, name) {
    this.setState({[state]: name})
  }
  deselectFilters() {
    this.setState({ sorted: !this.state.sorted })
    this.setState({ categoryChecked: !this.state.categoryChecked })
  }

  render() {
    return (
    <React.Fragment>
      <section className="container-bg">
            <RecipeForm
              toggleCollapse={this.toggleCollapse}
              collapse={this.state.collapse}
              {...this.props}
            />
      </section>
      <section id="top-bar">
        <div className="browse">
          <span onClick={this.toggleSidebar}>{this.state.sideBar ? <Remove color="#273762"/> : <Menu color="#273762"/>}</span>
          <h3>Browse Recipes</h3>
        </div>
        <AuthUserContext.Consumer>
        {(authUser) => authUser && <div className="topBarAccount"><h4>Account</h4><h4>{this.props.loadingUser && "loading ..."}{this.props.user}</h4></div>}
        </AuthUserContext.Consumer>
        {/* { !!users && <UserInfo users={this.props.users} newUser={this.newUser} /> } */}
      </section>
      <section className='display-recipes'>

        <DisplayUI
          authUser={this.props.authUser}
          setCategory={this.setCategory}
          displayCategory={this.state.displayCategory}
          recipes={this.props.recipes}
          user={this.props.user}
          filtered={this.state.filtered}
          //handleFilter={this.handleFilter}
          handleAllChecked={this.handleAllChecked}
          handleCheck={this.handleCheck}
          toggleCategoryButtons={this.toggleCategoryButtons}
          toggleCheckbox={this.toggleCheckbox}
          removeID={this.state.removeID}
          removeRecipe={this.removeRecipe}
          isModalOpen={this.state.isModalOpen}
          toggleModal={this.toggleModal}
          toggleTitle={this.toggleTitle}
          categoryChecked={this.state.categoryChecked}
          checkedItems={this.state.checkedItems}
          userChecked={this.state.userChecked}
          sorted={this.state.sorted}
          sorting={this.state.sorting}
          handleSort={this.handleSort}
          handleFilter={this.handleFilter}
          userFilter={this.state.userFilter}
          timeCookFilter={this.state.timeCookFilter}
          toggleSidebar={this.toggleSidebar}
          sideBar={this.state.sideBar}
          loading={this.props.loading}
        />
      </section>
    </React.Fragment>
    )
  }
}

RecipeMaker.propTypes = {
  user: PropTypes.string,
  login: PropTypes.func,
  logout: PropTypes.func,
  toggleDate: PropTypes.func,
  dateChange: PropTypes.bool,
  toggleCategoryButtons: PropTypes.func,
  filtered: PropTypes.bool,
  selectedCat: PropTypes.string,
}
export default RecipeMaker




