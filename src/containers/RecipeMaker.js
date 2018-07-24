import React, { Component } from 'react'
import PropTypes from 'prop-types';
import firebase from '../firebase.js'
import RecipeForm from '../components/RecipeForm.js';
import DisplayRecipe from '../components/DisplayRecipe.js';
import CategoryButtons from '../components/CategoryButtons.js';
import CategoryRecipes from '../components/CategoryRecipes.js';
import DateRecipes from '../components/DateRecipes.js';


class RecipeMaker extends Component {
  constructor() {
    super();
    this.state = {
    ingredValue: '',
    stepsValue: '',
    //filtering of recipe items
    selectedCat: '',
    filtered: false,
    dateChange: false,
    //remove recipe items
    isModalOpen: false,
		removeID: ''
    }

    this.toggleCollapse = this.toggleCollapse.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.toggleCategoryButtons = this.toggleCategoryButtons.bind(this);
    this.toggleDate = this.toggleDate.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  toggleCollapse() {
		this.setState({collapse: !this.state.collapse});
	}
	handleFilter(val) {
		 this.setState({selectedCat: val});
	}
	toggleCategoryButtons() {
		this.setState({
			filtered: !this.state.filtered,
			selectedCat: ''
		});
	}
	toggleDate() {
		this.setState({
			dateChange: !this.state.dateChange
		});
	}
	removeItem(recipeId) {
	    const recipeRef = firebase.database().ref(`/recipes/${recipeId}`);
	    recipeRef.remove();
	 }
	openModal(id) {
		this.setState({ removeID: id });

		this.setState({ isModalOpen: !this.state.isModalOpen });
	}

	closeModal() {
		this.setState({ isModalOpen: false });
	}
  render() {
    return (
    <div className="app">
          {this.props.user ?
          <div>
            <section className="container">
              <div className="login">
                  <div className="logged-in-as"><p>Logged in as - {this.props.user.displayName || this.props.user.email}</p> </div>
                  <button className="logIn-Out" onClick={this.props.logout}>Log Out</button>
                  <div className='user-profile'>
                  <img src={this.props.user.photoURL} />
                  </div>
              </div>
              <div className="formWrapper">
                  <RecipeForm
                    {...this.props}
                    handleSubmit={this.props.handleSubmit}
                    collapse={this.state.collapse}
                    toggleCollapse={this.toggleCollapse}
                    ingredValue={this.state.ingredValue}
                    stepsValue={this.state.stepsValue}
                  />
              </div>
            </section>
            <section className='display-recipes'>
                <div className="wrapper">
                  <div className="filter-wrapper">
                    <h3>Browse By: </h3>
                    <h3 className="date" onClick={this.toggleDate}>Date - {this.state.dateChange ? `Latest` : `Oldest`}</h3>
                    <h3 className="category" onClick={this.toggleCategoryButtons}>{this.state.filtered ? `Close ✕` : `Category`}</h3>
                  </div>
                </div>
                {this.state.filtered ? <CategoryButtons handleFilter={this.handleFilter} {...this.props}/> : '' }
                {this.state.selectedCat ?
                  <CategoryRecipes
                    recipes={this.props.recipes}
                    isModalOpen={this.state.isModalOpen}
                    openModal={this.openModal}
                    closeModal={this.closeModal}
                    removeID={this.state.removeID}
                    removeItem={this.removeItem}
                    user={this.props.user}
                    selectedCat={this.state.selectedCat}
                    {...this.props}
                  /> :
                  this.state.dateChange ?
                  <DateRecipes
                    isModalOpen={this.state.isModalOpen}
                    openModal={this.openModal}
                    closeModal={this.closeModal}
                    removeID={this.state.removeID}
                    removeItem={this.removeItem}
                    user={this.props.user}
                    {...this.props}
                  />
                  : <DisplayRecipe
                    isModalOpen={this.state.isModalOpen}
                    openModal={this.openModal}
                    closeModal={this.closeModal}
                    removeID={this.state.removeID}
                    removeItem={this.removeItem}
                    user={this.props.user}
                    {...this.props}
                  />
                }
            </section>
          </div>
          : <div>
             <p>You must be logged in to see the Recipe Maker and list.</p>
             <button onClick={this.props.login}>Log In</button>
            </div>
           }
    </div>

    )
  }
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
export default RecipeMaker




