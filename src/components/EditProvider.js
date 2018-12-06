import React from 'react';
import AuthInfoContext from './AuthInfoContext';
import { firebase } from '../firebase';

class EditProvider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            deleted: [],
            editRecipe: [],
            editable: '',
            editID: [],
            canEdit: false,
        };
        this.updateRecipe = this.updateRecipe.bind(this);
        this.getRecipe = this.getRecipe.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onArraySubmit = this.onArraySubmit.bind(this);
        this.onEditSubmit = this.onEditSubmit.bind(this);
    };
    getRecipe (name) {
		const recipes = this.props.recipes;
		const filterRecipes = recipes.filter(recipe => {
			if (recipe.id === name) {
				return recipe
			}
		})
		//this will make a deep copy of the filterRecipes array, so there is not a reference to recipes array
		const newRecipe = JSON.parse(JSON.stringify(filterRecipes ));
		//console.log(newRecipe);
		this.setState({
			editRecipe: newRecipe,
			editable: name,
			canEdit: true
        });
		console.log(newRecipe);
		console.log(this.state.editRecipe);
  }
  updateRecipe(e, id) {
		e.preventDefault();
		const editRecipe = this.state.editRecipe;
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
		console.log("removeID");
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
          <AuthInfoContext.Provider value={{
            state: this.state,
            getRecipe: this.getRecipe
        }}>
              {this.props.children}

          </AuthInfoContext.Provider>
      );
    }
}

export default EditProvider;