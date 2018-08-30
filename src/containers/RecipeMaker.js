import React, { Component } from 'react'
import PropTypes from 'prop-types';
import firebase from '../firebase.js'
import RecipeForm from '../components/RecipeForm.js';
import DisplayUI from '../components/DisplayUI';
import CategoryAPI from '../categories';
import Menu from '../icons/Menu';
import Remove from '../icons/Remove';
import RecipeIcon from '../icons/RecipeIcon';


class RecipeMaker extends Component {
  constructor() {
    super();
    this.state = {
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
    //remove recipe items
    isModalOpen: false,
		removeID: ''
    }
    this.toggleCollapse = this.toggleCollapse.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.toggleCategoryButtons = this.toggleCategoryButtons.bind(this);
    this.toggleDate = this.toggleDate.bind(this);
    this.toggleTitle = this.toggleTitle.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.filterUsers = this.filterUsers.bind(this);
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

  // setFilter (category) {
  //   this.setState((state) => ({
  //     filters: Object.assign({}, state.filters, { [category]: !state.filters[category] })
  //   }));
  // }
  handleFilter(index, e) {
      let newItems = this.state.displayCategory.slice();
      newItems[index].checked = !newItems[index].checked
      let checked = this.state.displayCategory.find(function (obj) { return obj.checked === true; });
      checked ? this.setState({ categoryChecked: true }) : this.setState({ categoryChecked: false })
      this.setState({
        displayCategory: newItems,
      })
  }
  handleSort(name) {
    //this.setState({ sorted: true })
    this.setState({ sorting: name })
  }
  filterUsers(name) {
    this.setState({userFilter: name})
  }
  deselectFilters() {
    this.setState({ sorted: !this.state.sorted })
    this.setState({ categoryChecked: !this.state.categoryChecked })
  }
    //const item = e.target.name;
    //const isChecked = e.target.checked;
    //this.setState(prevState => ({ checkedItems: prevState.checkedItems.set( item, isChecked) }));
    //const filtered = recipes.map(recipe => recipe.category);
        //recipe.category.map(category => categoryArray.indexOf(category) < 0 && categoryArray.push(category)));
    // const filtered = this.state.checkedItems.forEach(array =>
    //   array.filter(item => item[0])
    // )
    //const filteredResults = this.state.cards.filter( result => !this.state.filterOut.includes(result.category) )
    //Array.from(props.checkedItems).filter( item => !item.includes(category) )
    //const filtered = Array.from(this.state.checkedItems).map(thing => thing.filter(cat => cat[1] === true));
    //console.log(filtered);
    //this.setState({displayCategory: this.state.checkedItems});
  render() {

    return (
    <div className="app">

          {this.props.user ?
          <React.Fragment>
            <section className="container">
              <div className="appTitle"> <RecipeIcon /> <h3>Recipe Share</h3></div>

              <div className="formWrapper">
                  <RecipeForm
                    toggleCollapse={this.toggleCollapse}
                    collapse={this.state.collapse}
                    {...this.props}
                  />
              </div>
            </section>
            <div id="top-bar">
              <div className="browse">
                <span onClick={this.toggleSidebar}>{this.state.sideBar ? <Remove color="#273762"/> : <Menu color="#273762"/>}</span>
                <h3>Browse Recipes</h3>
              </div>
              <div className="login">
                <div className="logged-in-as"><p>Logged in as - {this.props.user.displayName || this.props.user.email}</p> </div>
                <button className="logIn-Out" onClick={this.props.logout}>Log Out</button>
                {/* <div className='user-profile'>
                  <img src={this.props.user.photoURL} />
                </div> */}
              </div>
            </div>
            <section className='display-recipes'>

              <DisplayUI
              setCategory={this.setCategory}
              displayCategory={this.state.displayCategory}
              recipes={this.props.recipes}
              user={this.props.user}
              filtered={this.state.filtered}
              handleFilter={this.handleFilter}
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
              userFilter={this.state.userFilter}
              filterUsers={this.filterUsers}
              toggleSidebar={this.toggleSidebar}
              sideBar={this.state.sideBar}
              />
            </section>
          </React.Fragment>
          : <div>
             <p>You must be logged in to see the Recipe Maker and list.</p>
             <button onClick={this.props.login}>Log In</button>
            </div>
           }
    </div>
    )
  }
}

RecipeMaker.propTypes = {
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
export default RecipeMaker




