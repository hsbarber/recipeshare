import React, { Component } from 'react'
import {  Switch, Route, Router, withRouter } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import firebase, { auth, db } from '../firebase/firebase'
import AuthUserContext from '../components/AuthUserContext';
import Header from '../components/Header';
import RecipeMaker from './RecipeMaker';
import FullRecipe from '../components/FullRecipe';
import Edit from '../components/Edit';
import SignUp from '../components/SignUp';
import SignIn from '../components/SignIn';
import PasswordForget from '../components/PasswordForget';
import Account from '../components/Account';
import * as routes from '../constants/routes';
import withAuthentication from '../components/withAuthentication';


// a function to help with reordering dragEnd result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
	return result;
};

const firstChild = props => {
	const childrenArray = React.Children.toArray(props.children);
	return childrenArray[0] || null;
};
class Main extends Component {
	constructor() {
	    super();
	    this.state = {
			user: null,
			users: null,
			authCopyUser: null,
			title: '',
			person: '',
			//imageupload
			image: '',
			imageURL: '',
			//image upload checking
			isUploading: false,
			progress: 0,
			error: '',
			//more form values
			category: 'American',
			recipeTime: 'Short - less than 1 hour',
			notes: '',
			link: '',
			ingredients: [],
			steps: [],
			//form validation
			formValid: false,
			errors: {},
			errorAnimate: false,
			loading: true,
			loadingUser: true,
			editRecipe: [],
			editable: '',
			canEdit: false,
			editID: [],
			//recipes array
			recipes: [],
		}
			this.changeUser = this.changeUser.bind(this);
			this.handleUploadStart = this.handleUploadStart.bind(this);
			this.handleProgress = this.handleProgress.bind(this);
			this.handleUploadError = this.handleUploadError.bind(this);
			this.handleUploadSuccess = this.handleUploadSuccess.bind(this);
			this.handleSelect = this.handleSelect.bind(this);
			this.handleChange = this.handleChange.bind(this);
			this.addItemArray = this.addItemArray.bind(this);
			this.validateForm = this.validateForm.bind(this);
			this.handleSubmit = this.handleSubmit.bind(this);
			this.handleRemove = this.handleRemove.bind(this);
			this.onDragEnd = this.onDragEnd.bind(this);
			this.onDragEndSteps = this.onDragEndSteps.bind(this);
			this.updateRecipe = this.updateRecipe.bind(this);
			this.getRecipe = this.getRecipe.bind(this);
			this.onEdit = this.onEdit.bind(this);
			this.onCancel = this.onCancel.bind(this);
			this.onDelete = this.onDelete.bind(this);
			this.onArraySubmit = this.onArraySubmit.bind(this);
			this.onEditSubmit = this.onEditSubmit.bind(this);
	  }

	componentDidMount() {
		this.hydrateStateWithLocalStorage();

		// add event listener to save state to localStorage
		// when user leaves/refreshes the page
		window.addEventListener(
			"beforeunload",
		this.saveStateToLocalStorage.bind(this));

		auth.onAuthStateChanged(authCopyUser => {
			authCopyUser
			  ? this.setState({ authCopyUser})

			  : this.setState({ authCopyUser: null });
		  });
		const usersRef = firebase.database().ref('users');
		usersRef.on('value', (snapshot) => {
			let users = snapshot.val();
			let newUsers = []
			for (let user in users) {
				newUsers.push({
				email: users[user].email ,
				username: users[user].username,
				})
			}
			this.setState({ users: newUsers })
			let usersArray = this.state.users;
			usersArray.forEach(user => {
				if ( this.state.authCopyUser != null && user.email === this.state.authCopyUser.email) {
					this.setState({ user: user.username, loadingUser: false });
				}
			})
		});


		const recipesRef = firebase.database().ref('recipes');
	    recipesRef.on('value', (snapshot) => {
	      	let recipes = snapshot.val();
			  let newState = [];
			  //console.log(recipesRef);
	      	for (let recipe in recipes) {
				newState.push({
				id: recipe,
				email: recipes[recipe].email,
				user: recipes[recipe].user,
				title: recipes[recipe].title,
							imageURL: recipes[recipe].imageURL,
				category: recipes[recipe].category,
				recipeTime: recipes[recipe].recipeTime,
				notes: recipes[recipe].notes,
				link: recipes[recipe].link,
				steps: recipes[recipe].steps,
				ingredients: recipes[recipe].ingredients,
				time: recipes[recipe].time
				});
	      	}
			this.setState({
				recipes: newState,
				loading: false
			});
	    });
	}
	componentWillUnmount() {
		window.removeEventListener(
		  "beforeunload",
		  this.saveStateToLocalStorage.bind(this)
		);

		// saves if component has a chance to unmount
		this.saveStateToLocalStorage();
	}
	//local storage - when component mounts, set state from local storage
	hydrateStateWithLocalStorage() {
		// for every item in state
		for (let key in this.state) {
		  // if the key exists in localStorage
		  if (localStorage.hasOwnProperty(key)) {
			// get the key's value from localStorage
			let value = localStorage.getItem(key);

			// parse the localStorage string and setState
			try {
			  value = JSON.parse(value);
			  this.setState({ [key]: value });
			} catch (e) {
			  // handle empty string
			  this.setState({ [key]: value });
			}
		  }
		}
	}
	//local storage - when component unmounts, save state to local storage
	saveStateToLocalStorage() {
		// for every item in state, save to ls
		for (let key in this.state) {
		  localStorage.setItem(key, JSON.stringify(this.state[key]));
		}
	}
	changeUser = (user) => this.setState({user: user});
	handleUploadStart = () => this.setState({isUploading: true, progress: 0});
	handleProgress = (progress) => this.setState({progress});
	handleUploadError = (error) => {
		this.setState({isUploading: false});
		console.error(this.state.error);
	}
	handleUploadSuccess = (filename) => {
		this.setState({image: filename, progress: 100, isUploading: false});
		firebase.storage().ref('images').child(filename).getDownloadURL().then(url => this.setState({imageURL: url}));
	}
	//CATEGORY SELECT
	handleSelect(e, type) {
		this.setState({
			[type]: e.target.value
		});
	}
	//FORM CHANGE
	handleChange(e) {
		const name = e.target.name;
		const value = e.target.value;
		this.setState({[name]: value });
	}


	//ADD ITEMS TO INGREDIENTS OR STEPS ARRAY
	addItemArray = (value, name) => {
		//Assemble data
		const item = {content: value, id: Date.now()}
		// Update data
		this.state[name].push(item);
		// Update state
		this.setState({[name]:
			this.state[name]
		});
	}

	handleRemove(id, name){
		// Filter all item except the one to be removed
		const remainder = this.state[name].filter((item) => {
			if (item.id !== id) {
				return item;
			} else {
				return null;
			}
		});
		// Update state with filter
		this.setState({[name]: remainder});
	}

	//SUBMIT THE RECIPE FORM, ADDS INDIVIDUAL STATES TO RECIPE ARRAY
	handleSubmit(e) {
		e.preventDefault();

		const recipesRef = firebase.database().ref('recipes');
		const recipe = {
			user: this.state.user,
			email: this.state.authCopyUser.email,
			title: this.state.title,
			imageURL: this.state.imageURL,
			category: this.state.category,
			recipeTime: this.state.recipeTime,
			notes: this.state.notes,
			link: this.state.link,
			ingredients: this.state.ingredients,
			steps: this.state.steps,
			time: Date.now()
		}
		if (this.validateForm()) {
			recipesRef.push(recipe);
			this.setState({
				title: '',
				imageURL: '',
				category: 'American',
				recipeTime: 'Short - less than 1 hour',
				notes: '',
				link: '',
				ingredients: [],
				steps: [],
				time: '',
				ingredientsValid: false,
				stepsValid: false,
				formValid: false,
				errors: {},
				errorAnimate: false
			});
			alert("Form submitted");
		} else {
			this.setState({
				errorAnimate: true,
			})
		}
	}
	// VALIDATE FORM ON HANDLESUBMIT
	validateForm() {
		let errors = {};
		let title = this.state.title;
		let steps = this.state.steps;
		let ingredients = this.state.ingredients;
		let formValid = this.state.formValid;
		const errorForm = errors["form"] = "❗ You have errors in your form that need to be fixed before submitting";
		let ingredientsValid = ingredients.some( item => item['content'] === "" );
		let stepsValid = steps.some( item => item['content'] === "" );
		formValid = true;
		if( title.length <= 1 ) {
			formValid = false;
			errors["title"] = "*Please enter your title.";
			errorForm;
		}
		if(ingredients.length < 1) {
			formValid = false;
			errors["ingredients"] = "* You must have at least one ingredient entered.";
			errorForm;
		}
		if(ingredientsValid) {
			formValid = false;
			errors["ingredients"] = "* You cannot have any blank entries. Please delete any blank entries.";
			errorForm;
		}
		if(steps.length < 1) {
			formValid = false;
			errors["steps"] = "* You must have at least one step entered.";
			errorForm;
		}

		if(stepsValid) {
			formValid = false;
			errors["steps"] = "* You cannot have any blank entries. Please delete any blank entries.";
			errorForm;
		}
		this.setState({
			errors: errors
		  });
		return formValid;
	}


	// THIS IS A FUNCTION FOR REACT-BEAUTIFUL-DND THAT MONITORS THE REORDERING OF THE LIST
	// AND SETS STATE (FOR INGREDIENTS LIST)
	onDragEnd = result => {
		const { destination, source} = result;
		// dropped outside the list
		if (!destination) {
				return;
		}
		// dropped in original place
		if (
			destination.droppableId === source.droppableId &&
			destination.index === source.index
		){
			return;
		}
		const ingredients = reorder(
			this.state.ingredients,
			source.index,
			destination.index
		);
		this.setState({
			ingredients,
			});
	};
	// THIS IS A FUNCTION FOR REACT-BEAUTIFUL-DND THAT MONITORS THE REORDERING OF THE LIST
	// AND SETS STATE (FOR STEPS LIST)
	onDragEndSteps(result) {
		const { destination, source} = result;
		// dropped outside the list
		if (!destination) {
				return;
		}
		// dropped in original place
		if (
			destination.droppableId === source.droppableId &&
			destination.index === source.index
		){
			return;
		}
		const steps = reorder(
			this.state.steps,
			source.index,
			destination.index
		);
		this.setState({
			steps,
		});
	}
	getRecipe (name) {
		const recipes = this.state.recipes;
		const filterRecipes = recipes.filter(recipe => {
			if (recipe.id === name) {
				return recipe
			}
		})
		//this will make a deep copy of the filterRecipes array, so there is not a reference to recipes array
		const newRecipe = JSON.parse(JSON.stringify(filterRecipes ));
		console.log(newRecipe);
		this.setState({
			editRecipe: newRecipe,
			editable: name,
			canEdit: !this.state.canEdit
		});
	}
	updateRecipe(e, id) {
		e.preventDefault();
		const editRecipe = this.state.editRecipe;
		console.log(editRecipe)
		return firebase.database().ref(`/recipes/${id}`).set(editRecipe[0]),
		this.setState({
			canEdit: false
		}),
		alert("Updates submitted");


	}
	onEdit(id) {
		//on clicking the edit button, take the passed id
		// and put it into the editArray
		let editArray = this.state.editID;
        editArray.push(id);
        this.setState({editID: editArray });
	}
	removeID(name) {
		// this function filters the editID array to form a new
		// array without the item clicked. Then, the editID state
		// updated with a new state
		let editArray = [...this.state.editID];
        const remove = editArray.filter(e => e !== name);
        this.setState({editID: remove });
	}
	onCancel(e, name) {
        e.preventDefault();
        this.removeID(name);
	}
	onDelete(e, id, itemID, name) {
		e.preventDefault();
		let recipes = this.state.editRecipe;
		// Find the right recipe in the array of recipes with an id
		let recipeMatch = recipes.filter(recipe => {
			if (recipe.id === id ) {
			return recipe
		}
		})
		console.log(recipeMatch);
		//filter the array(ingredients or steps) to remove the item with the passed id
		let remainder = recipeMatch[0][name].filter((item) => {
			if (item.id !== itemID) {
				return item;
			} else {
				return null;
			}
		});
		console.log(remainder)
		//console.log(recipeMatch)
		let rm = recipeMatch[0][name] = remainder;
		//let rm = recipes.splice(name, 1, remainder);
		console.log(rm);
		console.log(recipeMatch);
		this.removeID(itemID);
		// Update recipes state with deleted item
		this.setState({...recipes, rm});
	}
	onEditSubmit( e, id, value, name) {
		e.preventDefault();
		let recipes = this.state.editRecipe;
		// Find the right recipe in the array of recipes with an id and
		// then assign the recipe's property the new value
		recipes = recipes.map(recipe => {
			if (recipe.id === id ) {
				recipe[name] = value
			}
			return recipe;

		})
		this.removeID(name);
		//update the state of recipes array with new value
		this.setState({editRecipe: recipes});
	}
	onArraySubmit (e, id, itemID, value, name) {
		e.preventDefault();
		let recipes = this.state.editRecipe;
		// Find the right recipe in the array of recipes with an id
		let recipeMatch = recipes.filter(recipe => {
			if (recipe.id === id ) {
			return recipe
		}
		})
		//filter recipes list (ingredients or steps) to see if there is an item that matches
		// the passed in id
		let recipeFilter = recipeMatch[0][name].filter(item => {
			if (item.id === itemID ) {
				item.content = value
			}
			return item;
		})

		//remove list item from save state (remove from editArray)
		this.removeID(itemID);
		//update recipes array with new value
		this.setState({...recipes, recipeMatch});

	}
	render() {
	    return (
			<React.Fragment>
				<Header changeUser={this.changeUser}/>
					<Switch>
								<Route
									exact path={routes.SIGN_UP}
									render={()=> <SignUp changeUser={this.changeUser} />}
								/>
								<Route
									exact path={routes.SIGN_IN}
									render={()=> <SignIn changeUser={this.changeUser} users={this.state.users} />}
								/>
								<Route
									exact path={routes.PASSWORD_FORGET}
									component={PasswordForget}
								/>
								<Route
									exact path={routes.ACCOUNT}
									render={()=> <Account user={this.state.user} />}
								/>
								<Route exact path='/' render={(props)=>
									<RecipeMaker
											{...props}
											login={this.login}
											logout={this.logout}
											loading={this.state.loading}
											loadingUser={this.state.loadingUser}
											user={this.state.user}
											users={this.state.users}
											title={this.state.title}
											//form validation
											errorAnimate={this.state.errorAnimate}
											errors={this.state.errors}
											//image upload
											imageURL={this.state.imageURL}
											isUploading={this.state.isUploading}
											progress={this.state.progress}
											error={this.state.error}
											handleUploadStart = {this.handleUploadStart}
											handleProgress={this.handleProgress}
											handleUploadError={this.handleUploadError}
											handleUploadSuccess={this.handleUploadSuccess}
											// form states
											category={this.state.category}
											recipeTime={this.state.recipeTime}
											notes={this.state.notes}
											link={this.state.link}
											steps={this.state.steps}
											ingredients={this.state.ingredients}
											recipes={this.state.recipes}
											//handle functions
											handleSelect={this.handleSelect}
											handleChange={this.handleChange}
											handleSubmit={this.handleSubmit}
											addItemArray={this.addItemArray}
											remove={this.handleRemove}
											//react-dnd-beautiful functions
											onDragEnd={this.onDragEnd}
											onDragEndSteps={this.onDragEndSteps}
									/>
								}/>
								<Route path='/:title-edit' render={(props)=>
									<Edit
										{...props}
										authCopyUser={this.state.authCopyUser}
										title={this.state.title}
										category={this.state.category}
										recipeTime={this.state.recipeTime}
										editRecipe={this.state.editRecipe}
										editable={this.state.editable}
										canEdit={this.state.canEdit}
										getRecipe={this.getRecipe}
										handleChange={this.handleChange}
										handleSelect={this.handleSelect}
										recipes={this.state.recipes}
										updateRecipe={this.updateRecipe}
										onEditSubmit={this.onEditSubmit}
										onArraySubmit={this.onArraySubmit}
										editID={this.state.editID}
										onEdit={this.onEdit}
										onCancel={this.onCancel}
										onDelete={this.onDelete}
										imageURL={this.state.imageURL}
										isUploading={this.state.isUploading}
										progress={this.state.progress}
										error={this.state.error}
										handleUploadStart = {this.handleUploadStart}
										handleProgress={this.handleProgress}
										handleUploadError={this.handleUploadError}
										handleUploadSuccess={this.handleUploadSuccess}
									/>
								}/>
								<Route path='/:title' render={(props)=>
									<FullRecipe

										{...props}
										authCopyUser={this.state.authCopyUser}
										title={this.state.title}
										category={this.state.category}
										recipeTime={this.state.recipeTime}
										editRecipe={this.state.editRecipe}
										editable={this.state.editable}
										canEdit={this.state.canEdit}
										getRecipe={this.getRecipe}
										handleChange={this.handleChange}
										handleSelect={this.handleSelect}
										recipes={this.state.recipes}
										updateRecipe={this.updateRecipe}
										onEditSubmit={this.onEditSubmit}
										onArraySubmit={this.onArraySubmit}
										editID={this.state.editID}
										onEdit={this.onEdit}
										onCancel={this.onCancel}
										onDelete={this.onDelete}
										imageURL={this.state.imageURL}
										isUploading={this.state.isUploading}
										progress={this.state.progress}
										error={this.state.error}
										handleUploadStart = {this.handleUploadStart}
										handleProgress={this.handleProgress}
										handleUploadError={this.handleUploadError}
										handleUploadSuccess={this.handleUploadSuccess}
									/>
								}/>
							</Switch>
			</React.Fragment>
	    );
	}
}
export default withAuthentication(Main);

{/* <Route render={({ location }) => (
					<TransitionGroup>
						<CSSTransition
							timeout={300}
							classNames='fade'
							key={location.key}
						>
							<Switch location={location}> */}
