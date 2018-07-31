import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import firebase, { auth, provider } from '../firebase.js'
import RecipeMaker from './RecipeMaker'
import FullRecipe from '../components/FullRecipe'

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
				ingredients: [],
				steps: [],
				//form validation
				formErrors: {title: '', ingredients: '', steps: ''},
				formValid: false,
				ingredientsValid: false,
				stepsValid: false,
				titleValid: false,
				//recipes array
				recipes: [],
			}
			this.login = this.login.bind(this);
    		this.logout = this.logout.bind(this);
			this.handleUploadStart = this.handleUploadStart.bind(this);
			this.handleProgress = this.handleProgress.bind(this);
			this.handleUploadError = this.handleUploadError.bind(this);
			this.handleUploadSuccess = this.handleUploadSuccess.bind(this);
			this.checkButton = this.checkButton.bind(this);
			this.handleSelect = this.handleSelect.bind(this);
			this.handleChange = this.handleChange.bind(this);
			this.addItemArray = this.addItemArray.bind(this);
			this.validateForm = this.validateForm.bind(this);
			this.validate = this.validate.bind(this);
			this.handleSubmit = this.handleSubmit.bind(this);
			this.handleRemove = this.handleRemove.bind(this);
			this.onDragEnd = this.onDragEnd.bind(this);
			this.onDragEndSteps = this.onDragEndSteps.bind(this);
  	}
	componentDidMount() {
		//Persisting Login Across Refresh
    auth.onAuthStateChanged((user) => {
			if (user) {
			this.setState({ user });
			}
		});
			const recipesRef = firebase.database().ref('recipes');
	    recipesRef.on('value', (snapshot) => {
	      let recipes = snapshot.val();
	      let newState = [];
	      for (let recipe in recipes) {
	        newState.push({
						id: recipe,
						user: recipes[recipe].user,
	          title: recipes[recipe].title,
						imageURL: recipes[recipe].imageURL,
	          category: recipes[recipe].category,
	          steps: recipes[recipe].steps,
	          ingredients: recipes[recipe].ingredients,
	          time: recipes[recipe].time
	        });
	      }
	      this.setState({
	        recipes: newState
	      });
	    });
	}
  logout() {
      auth.signOut()
          .then(() => {
          this.setState({
              user: null
          });
      });
  }
  login() {
      auth.signInWithPopup(provider)
          .then((result) => {
          const user = result.user;
          this.setState({
              user
          });
          });
	}
	//IMAGE UPLOAD

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
	handleSelect(e) {
		this.setState({
			category: e.target.value
		});
	}
	//FORM CHANGE
	handleChange(e) {
		const name = e.target.name;
		const value = e.target.value;
		this.setState({[name]: value},
				() => { this.validate(name, value) });
	}
	// CHECK INGREDIENTS AND STEPS BUTTONS FOR INPUT LENGTH
	checkButton = (value, name) => {
		this.validate(name + 's', value);
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
		this.validate(name, value);
	};
	//VALIDATE FORM
	validate(fieldName, value) {
		// console.log(this.state[fieldName])
		let fieldValidationErrors = this.state.formErrors;
		let titleValid = this.state.titleValid;
		let ingredientsValid = this.state.ingredientsValid;
		let stepsValid = this.state.stepsValid;
		switch(fieldName) {
			case 'title':
				titleValid = value.length > 0;
				fieldValidationErrors[fieldName] = titleValid ? '' : ' must have an entry';
				break;
				default:
				break;
			case 'ingredients':
				ingredientsValid = value.length >= 1;
				fieldValidationErrors[fieldName] = ingredientsValid ? '' : ' must have an entry';
				break;
			case 'steps':
				stepsValid = value.length >= 1;
				fieldValidationErrors[fieldName] = stepsValid ? '' : ' must have an entry';
				break;
		}
		this.setState({formErrors: fieldValidationErrors,
			titleValid: titleValid,
			ingredientsValid: ingredientsValid,
			stepsValid: stepsValid,
		}, this.validateForm);

	}
	validateForm() {
				this.setState({formValid: this.state.titleValid && this.state.ingredientsValid && this.state.stepsValid});
	}
	//SUBMIT THE RECIPE FORM, ADDS INDIVIDUAL STATES TO RECIPE ARRAY
	handleSubmit(e) {
		e.preventDefault();
		console.log('submitted');
		const recipesRef = firebase.database().ref('recipes');
		const recipe = {
			user: this.state.user.email,
			title: this.state.title,
			imageURL: this.state.imageURL,
			category: this.state.category,
			ingredients: this.state.ingredients,
			steps: this.state.steps,
			time: Date.now()
		}
		recipesRef.push(recipe);
		this.setState({
			//user: '',
			title: '',
			imageURL: '',
			category: 'American',
			ingredients: [],
			steps: [],
			time: '',
			ingredientsValid: false,
			stepsValid: false,
			formValid: false
		});
	}
	//REMOVE INGREDIENTS OR STEPS FROM FORM
	handleRemove(id, name){
		// Filter all item except the one to be removed
		const remainder = this.state[name].filter((item) => {
			if(item.id !== id) return item;
		});
		// Update state with filter
		this.setState({[name]: remainder});
		this.validate(name, remainder);
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

		    <Switch>

		      <Route exact path='/' render={(props)=>

					<RecipeMaker
							{...props}
							login={this.login}
							logout={this.logout}
							user={this.state.user}
							title={this.state.title}

							//form validation
							formErrors={this.state.formErrors}
							formValid={this.state.formValid}
							ingredientsValid={this.state.ingredientsValid}
							stepsValid={this.state.stepsValid}
							titleValid={this.state.titleValid}
							validateForm={this.validateForm}
							validate={this.validate}
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
							steps={this.state.steps}
							ingredients={this.state.ingredients}
							recipes={this.state.recipes}
							checkButton={this.checkButton}
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
	    	}
		    </Switch>

	    )
	}
}

export default Main
