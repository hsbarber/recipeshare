import React, { Component } from 'react'
import {  Switch, Route } from 'react-router-dom'
import firebase, { auth, db } from '../firebase/firebase'
import AuthUserContext from '../components/AuthUserContext';
import Header from '../components/Header'
import RecipeMaker from './RecipeMaker'
import FullRecipe from '../components/FullRecipe'
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

class Main extends Component {
	constructor() {
	    super();
	    this.state = {
			user: null,
			users: null,
			authCopyUser: null,
			title: '',
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
	  }

	componentDidMount() {
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
	render() {
	    return (
		<React.Fragment>
			<Header />
				<Switch>
					<Route
						exact path={routes.SIGN_UP}
						component={SignUp}
					/>
					<Route
						exact path={routes.SIGN_IN}
						render={()=> <SignIn changeUser={this.changeUser} user={this.state.user}
							authCopyUser={this.state.authCopyUser} users={this.state.users}
						/>}
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
					<Route path='/:title' component={(props) => <FullRecipe {...props} recipes={this.state.recipes}/>} />
				</Switch>
		</React.Fragment>
	    )
	}
}

export default withAuthentication(Main);
