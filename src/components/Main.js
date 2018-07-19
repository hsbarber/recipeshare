import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import firebase, { auth, provider } from '../firebase.js'
import RecipeMaker from './RecipeMaker'
import FullRecipe from './FullRecipe'

window.id = 0;
class Main extends Component {
	constructor() {
	    super();
	    this.state = {
	      username: '',
				user: null,
				collapse: true,
	      title: '',
	      img: '',
	      image: '',
				category: 'American',
				error: '',
	      steps: [],
	      recipes: [],
				ingredValue: '',
				stepsValue: '',
				ingredients: [],
	      selectedCat: '',
	      filtered: false,
	      dateChange: false,
				file: '',
				uploaded: false,
				formErrors: {title: '', ingredients: '', steps: ''},
				ingredientsValid: false,
				stepsValid: false,
				titleValid: false,
				formValid: false,
				isModalOpen: false,
				removeID: ''
			}

	    this.login = this.login.bind(this);
			this.logout = this.logout.bind(this);
			this.toggleCollapse = this.toggleCollapse.bind(this);
	    this.handleChange = this.handleChange.bind(this);
	    this.handleSelect = this.handleSelect.bind(this);
	    this.handleSubmit = this.handleSubmit.bind(this);
	    this.handleFileSelect = this.handleFileSelect.bind(this);
	    this.handleFileUpload = this.handleFileUpload.bind(this);
	    this.printImage = this.printImage.bind(this);
	    this.addItemArray = this.addItemArray.bind(this);
	    this.handleRemove = this.handleRemove.bind(this);
	    this.handleFilter = this.handleFilter.bind(this);
	    this.toggleCategoryButtons = this.toggleCategoryButtons.bind(this);
			this.toggleDate = this.toggleDate.bind(this);
			this.validateForm = this.validateForm.bind(this);
			this.validate = this.validate.bind(this);
			this.openModal = this.openModal.bind(this);
			this.closeModal = this.closeModal.bind(this);
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
						img: recipes[recipe].img,
						image: recipes[recipe].image,
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
	toggleCollapse() {
		this.setState({collapse: !this.state.collapse});
	}
	handleSelect(e) {
	    this.setState({
	      category: e.target.value
	    });
	}
	handleChange(e) {
		const name = e.target.name;
		const value = e.target.value;
		this.setState({[name]: value},
				() => { this.validate(name, value) });
	}
	handleSubmit(e) {
			e.preventDefault();
	    const recipesRef = firebase.database().ref('recipes');
	    const recipe = {
				user: this.state.user.email,
	      title: this.state.title,
				img: this.state.img,
				image: this.state.image,
	      category: this.state.category,
	      ingredients: this.state.ingredients,
	      steps: this.state.steps,
	      time: Date.now()
	    }
			recipesRef.push(recipe);
			// this.printImage(e);
	    this.setState({
	      title: '',
				img: '',
				image: '',
	      category: 'American',
	      ingredients: [],
	      steps: [],
				time: '',
				uploaded: false,
				ingredientsValid: false,
				stepsValid: false,
				formValid: false
			});

	}
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
	addItemArray(value, name){
			//Assemble data
			const item = {text: value, id: window.id++}
			// Update data
	    this.state[name].push(item);
	    // Update state
			this.setState({[name]: this.state[name]});
			this.validate(name, value);

	}

	handleFileSelect(e) {
    	this.setState({file: e.target.files[0]})
		}
	printImage(e) {
		e.preventDefault();
		const file = this.state.file;
		const thisRef = firebase.storage().ref().child("images/" + file.name);
		thisRef.getDownloadURL().then(url => this.setState({image: url}))
	}
	handleFileUpload(e) {
			e.preventDefault();
				const storageRef = firebase.storage().ref();
				const file = this.state.file;

				const thisRef = storageRef.child("images/" + file.name);
				thisRef.put(file).then(
						this.setState({uploaded: true})
				)
				//.then(thisRef.getDownloadURL().then(url => this.setState({image: url})))
				// const newRef = firebase.storage().ref().child("images/" + file.name);
				// newRef.getDownloadURL().then(url => this.setState({image: url}))
				.catch(err => this.setState({error: err.message}))

	}

	handleRemove(id, name){
	    // Filter all ingredients except the one to be removed
	    const remainder = this.state[name].filter((item) => {
	      if(item.id !== id) return item;
			});
	    // Update state with filter
			this.setState({[name]: remainder});
			this.validate(name, remainder);
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

		    <Switch>

		      <Route exact path='/' render={()=><RecipeMaker
						user={this.state.user}
		      	login={this.login}
						logout={this.logout}
						collapse={this.state.collapse}
						toggleCollapse={this.toggleCollapse}
						title={this.state.title}
						error={this.state.error}
		      	img={this.state.img}
						image={this.state.image}
		      	file={this.state.file}
						uploaded={this.state.uploaded}
		      	category={this.state.category}
	            steps={this.state.steps}
	            handleChange={this.handleChange}
	            handleFileSelect={this.handleFileSelect}
	            handleFileUpload={this.handleFileUpload}
	            printImage={this.printImage}
	            handleSelect={this.handleSelect}
	            handleFilter={this.handleFilter}
	            handleSubmit={this.handleSubmit}
	            addItemArray={this.addItemArray}
	            ingredients={this.state.ingredients}
							ingredValue={this.state.ingredValue}
							stepsValue={this.state.stepsValue}
	            remove={this.handleRemove.bind(this)}
	            recipes={this.state.recipes}
	            time={this.state.time}
	            handleRemove={this.handleRemove}
	            removeItem={this.removeItem}
	            selectedCat={this.state.selectedCat}
	            filtered={this.state.filtered}
	            dateChange={this.state.dateChange}
	            toggleDate={this.toggleDate}
	            toggleCategoryButtons={this.toggleCategoryButtons}
	            removeFilter={this.removeFilter}
							formErrors={this.state.formErrors}
							formValid={this.state.formValid}
							errorMessage={this.state.errorMessage}
							closeModal={this.closeModal}
							openModal={this.openModal}
							isModalOpen={this.state.isModalOpen}
							removeID={this.state.removeID}

		      	/>}/>
		      <Route path='/:title' component={(props) => <FullRecipe {...props} recipes={this.state.recipes}/>} />
	    	}
		    </Switch>

	    )
	}
}

export default Main

// .then(function (snapshot) {
// 	console.log(`Uploaded ${file.name}`);
// });
// addItemArray(val, name){
// 	//Assemble data
// 	const item = {text: val, id: window.id++}
// 	this.validateField(name, val)
// 	// Update data
// 	this.state[name].push(item);
// 	// Update state
// 	this.setState({name: this.state.name});

// }