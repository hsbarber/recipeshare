import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import firebase, { auth } from '../firebase/firebase';
import Header from '../components/Header';
import RecipeMaker from './RecipeMaker';
import FullRecipe from '../components/FullRecipe';
import Edit from '../components/Edit';
import SignUp from '../components/SignUp';
import SignIn from '../components/SignIn';
import { PasswordForget } from '../components/PasswordForget';
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

// const firstChild = props => {
//   const childrenArray = React.Children.toArray(props.children);
//   return childrenArray[0] || null;
// };
class Main extends Component {
  constructor() {
    super();
    this.state = {
      user: JSON.parse(localStorage.getItem('user')),
      email: null,
      users: null,
      authCopyUser: null,
      title: '',
      person: '',
      // imageupload
      image: '',
      imageURL: '',
      // image upload checking
      isUploading: false,
      progress: 0,
      error: '',
      // more form values
      categoryVal: 'American',
      category: 'American',
      recipeTime: '',
      notes: '',
      link: '',
      ingredients: [],
      steps: [],
      // form validation
      formValid: false,
      errors: {},
      errorAnimate: false,
      loading: true,
      editID: '',
      // recipes array
      recipes: [],
      // pending: true,
      // loggedIn: null
    };
    this.changeUser = this.changeUser.bind(this);
    this.handleUploadStart = this.handleUploadStart.bind(this);
    this.handleProgress = this.handleProgress.bind(this);
    this.handleUploadError = this.handleUploadError.bind(this);
    this.handleUploadSuccess = this.handleUploadSuccess.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleNewSelect = this.handleNewSelect.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addItemArray = this.addItemArray.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onDragEndSteps = this.onDragEndSteps.bind(this);
  }

  componentDidMount() {
    this.hydrateStateWithLocalStorage();

    auth.onAuthStateChanged(authCopyUser => {
      if (authCopyUser) {
        this.setState({ authCopyUser });
      } else {
        this.setState({ authCopyUser: null });
      }
    });
    const usersRef = firebase.database().ref('users');
    usersRef.on('value', snapshot => {
      const usersSnap = snapshot.val();
      const newUsers = [];
      Object.keys(usersSnap).forEach(user => {
        newUsers.push({
          email: usersSnap[user].email,
          username: usersSnap[user].username,
        });
      });
      this.setState({ users: newUsers });
      const { authCopyUser, users } = this.state;
      users.forEach(user => {
        if (authCopyUser != null && user.email === authCopyUser.email) {
          this.setState({ user: user.username });
        }
      });
    });

    const recipesRef = firebase.database().ref('recipes');
    recipesRef.on('value', snapshot => {
      const recipes = snapshot.val();
      const newState = [];
      // console.log(recipesRef);
      Object.keys(recipes).forEach(recipe => {
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
          time: recipes[recipe].time,
        });
      });
      this.setState({
        recipes: newState,
        loading: false,
      });
    });
  }

  componentDidUpdate() {
    const { recipes } = this.state;
    localStorage.setItem('recipes', JSON.stringify(recipes));
  }

  componentWillUnmount() {
    window.removeEventListener(
      'beforeunload',
      this.saveStateToLocalStorage.bind(this)
    );

    // saves if component has a chance to unmount
    this.saveStateToLocalStorage();
  }

  // THIS IS A FUNCTION FOR REACT-BEAUTIFUL-DND THAT MONITORS THE REORDERING OF THE LIST
  // AND SETS STATE (FOR INGREDIENTS LIST)
  onDragEnd = result => {
    const { destination, source } = result;
    const { ingredients } = this.state;
    // dropped outside the list
    if (!destination) {
      return;
    }
    // dropped in original place
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    const ingredientsReordered = reorder(
      ingredients,
      source.index,
      destination.index
    );
    this.setState({
      ingredients: ingredientsReordered,
    });
  };

  // THIS IS A FUNCTION FOR REACT-BEAUTIFUL-DND THAT MONITORS THE REORDERING OF THE LIST
  // AND SETS STATE (FOR STEPS LIST)
  onDragEndSteps(result) {
    const { steps } = this.state;
    const { destination, source } = result;
    // dropped outside the list
    if (!destination) {
      return;
    }
    // dropped in original place
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    const stepsReorder = reorder(steps, source.index, destination.index);
    this.setState({
      steps: stepsReorder,
    });
  }

  changeUser = (user, email) => {
    localStorage.setItem('user', JSON.stringify(user));
    this.setState({
      user,
      email,
    });
  };

  handleProgress = progress => this.setState({ progress });

  handleUploadError = error => {
    this.setState({ isUploading: false });
    console.error(error);
  };

  handleUploadSuccess = filename => {
    this.setState({ image: filename, progress: 100, isUploading: false });
    firebase
      .storage()
      .ref('images')
      .child(filename)
      .getDownloadURL()
      .then(url => this.setState({ imageURL: url }));
  };

  handleUploadStart = () => this.setState({ isUploading: true, progress: 0 });

  // ADD ITEMS TO INGREDIENTS OR STEPS ARRAY
  addItemArray = (value, name) => {
    const { [name]: setName } = this.state;
    // Assemble data
    const item = { content: value, id: Date.now() };
    // Update data[name]
    setName.push(item);
    // Update state
    this.setState({
      [name]: setName,
    });
  };

  // CATEGORY SELECT
  handleSelect(e, type) {
    this.setState({
      [type]: e.target.value,
    });
  }

  handleNewSelect(event) {
    this.setState({
      categoryVal: event.target.value,
    });
  }

  // FORM CHANGE
  handleChange(e) {
    const { name } = e.target;
    const { value } = e.target;
    this.setState({ [name]: value });
  }

  // SUBMIT THE RECIPE FORM, ADDS INDIVIDUAL STATES TO RECIPE ARRAY
  handleSubmit(e) {
    e.preventDefault();
    const recipesRef = firebase.database().ref('recipes');
    const {
      user,
      authCopyUser,
      title,
      imageURL,
      category,
      recipeTime,
      notes,
      link,
      ingredients,
      steps,
    } = this.state;
    const recipe = {
      user,
      email: authCopyUser.email,
      title,
      imageURL,
      category,
      recipeTime,
      notes,
      link,
      ingredients,
      steps,
      time: Date.now(),
    };
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
        errorAnimate: false,
      });
      alert('Form submitted');
    } else {
      this.setState({
        errorAnimate: true,
      });
    }
  }

  // VALIDATE FORM ON HANDLESUBMIT
  validateForm() {
    const errors = {};
    const { title, steps, ingredients } = this.state;
    let { formValid } = this.state;
    const errorForm =
      '❗ You have errors in your form that need to be fixed before submitting';
    const ingredientsValid = ingredients.some(item => item.content === '');
    const stepsValid = steps.some(item => item.content === '');
    formValid = true;
    if (title.length <= 1) {
      formValid = false;
      errors.title = '* Please enter your title.';
      errors.form = errorForm;
    }
    if (ingredients.length < 1) {
      formValid = false;
      errors.ingredients = '* You must have at least one ingredient entered.';
      errors.form = errorForm;
    }
    if (ingredientsValid) {
      formValid = false;
      errors.ingredients =
        '* You cannot have any blank entries. Please delete any blank entries.';
      errors.form = errorForm;
    }
    if (steps.length < 1) {
      formValid = false;
      errors.steps = '* You must have at least one step entered.';
      errors.form = errorForm;
    }

    if (stepsValid) {
      formValid = false;
      errors.steps =
        '* You cannot have any blank entries. Please delete any blank entries.';
      errors.form = errorForm;
    }
    this.setState({
      errors,
    });
    return formValid;
  }

  handleRemove(id, name) {
    const { [name]: setName } = this.state;
    // Filter all item except the one to be removed
    const remainder = setName.filter(item => {
      if (item.id !== id) {
        return item;
      }
      return null;
    });
    // Update state with filter
    this.setState({ [name]: remainder });
  }

  // local storage - when component mounts, set state from local storage
  hydrateStateWithLocalStorage() {
    // for each item in state
    Object.keys(this.state).forEach(key => {
      // if the key exists in localStorage
      if (localStorage.hasOwnProperty.call(key)) {
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
    });
  }

  // local storage - when component unmounts, save state to local storage
  saveStateToLocalStorage() {
    const { state } = this;
    // for every item in state, save to ls
    Object.keys(state).forEach(key => {
      localStorage.setItem(key, JSON.stringify(state[key]));
    });
  }

  render() {
    const {
      user,
      users,
      loading,
      title,
      errorAnimate,
      errors,
      imageURL,
      isUploading,
      progress,
      error,
      category,
      categoryVal,
      recipeTime,
      notes,
      link,
      steps,
      ingredients,
      recipes,
      authCopyUser,
      editID,
    } = this.state;
    return (
      <React.Fragment>
        <Header changeUser={this.changeUser} />
        <Switch>
          <Route
            exact
            path={routes.SIGN_UP}
            render={() => <SignUp changeUser={this.changeUser} />}
          />
          <Route
            exact
            path={routes.SIGN_IN}
            render={() => <SignIn changeUser={this.changeUser} users={users} />}
          />
          <Route
            exact
            path={routes.PASSWORD_FORGET}
            component={PasswordForget}
          />
          <Route
            exact
            path={routes.ACCOUNT}
            render={() => <Account user={user} />}
          />

          <Route
            exact
            path="/"
            render={props => (
              <RecipeMaker
                {...props}
                login={this.login}
                logout={this.logout}
                loading={loading}
                user={user}
                users={users}
                title={title}
                // form validation
                errorAnimate={errorAnimate}
                errors={errors}
                // image upload
                imageURL={imageURL}
                isUploading={isUploading}
                progress={progress}
                error={error}
                handleUploadStart={this.handleUploadStart}
                handleProgress={this.handleProgress}
                handleUploadError={this.handleUploadError}
                handleUploadSuccess={this.handleUploadSuccess}
                // form states
                category={category}
                categoryVal={categoryVal}
                recipeTime={recipeTime}
                notes={notes}
                link={link}
                steps={steps}
                ingredients={ingredients}
                recipes={recipes}
                // handle functions
                handleSelect={this.handleSelect}
                handleNewSelect={this.handleNewSelect}
                handleChange={this.handleChange}
                handleSubmit={this.handleSubmit}
                addItemArray={this.addItemArray}
                remove={this.handleRemove}
                // // react-dnd-beautiful functions
                onDragEnd={this.onDragEnd}
                onDragEndSteps={this.onDragEndSteps}
              />
            )}
          />
          <Route
            exact
            path="/:title-edit"
            render={props => (
              <Edit
                {...props}
                authCopyUser={authCopyUser}
                title={title}
                category={category}
                recipeTime={recipeTime}
                // editRecipe={this.state.editRecipe}
                // editable={this.state.editable}
                // canEdit={this.state.canEdit}
                // getRecipe={this.getRecipe}
                handleChange={this.handleChange}
                handleSelect={this.handleSelect}
                recipes={recipes}
                updateRecipe={this.updateRecipe}
                onEditSubmit={this.onEditSubmit}
                onArraySubmit={this.onArraySubmit}
                editID={editID}
                onEdit={this.onEdit}
                onCancel={this.onCancel}
                onDelete={this.onDelete}
                imageURL={imageURL}
                isUploading={isUploading}
                progress={progress}
                error={error}
                handleUploadStart={this.handleUploadStart}
                handleProgress={this.handleProgress}
                handleUploadError={this.handleUploadError}
                handleUploadSuccess={this.handleUploadSuccess}
                user={user}
              />
            )}
          />
          <Route
            path="/:title"
            render={props => (
              <FullRecipe
                {...props}
                authCopyUser={authCopyUser}
                title={title}
                category={category}
                recipeTime={recipeTime}
                // editRecipe={this.state.editRecipe}
                // editable={this.state.editable}
                // canEdit={this.state.canEdit}
                // getRecipe={this.getRecipe}
                handleChange={this.handleChange}
                handleSelect={this.handleSelect}
                recipes={recipes}
                updateRecipe={this.updateRecipe}
                onEditSubmit={this.onEditSubmit}
                onArraySubmit={this.onArraySubmit}
                editID={editID}
                onEdit={this.onEdit}
                onCancel={this.onCancel}
                onDelete={this.onDelete}
                imageURL={imageURL}
                isUploading={isUploading}
                progress={progress}
                error={error}
                handleUploadStart={this.handleUploadStart}
                handleProgress={this.handleProgress}
                handleUploadError={this.handleUploadError}
                handleUploadSuccess={this.handleUploadSuccess}
                user={user}
              />
            )}
          />
        </Switch>
      </React.Fragment>
    );
  }
}
export default withAuthentication(Main);
