import React from 'react';
import PropTypes from 'prop-types';
import firebase from '../firebase/firebase'
import { BrowserRouter as Router, Route, Switch, Link}  from 'react-router-dom'
import { Transition }  from 'react-spring'
import AuthUserContext from '../components/AuthUserContext';
import AuthInfoContext from '../components/AuthInfoContext';
import Edit from './Edit';
import { withEditContext } from './withEditContext';

class FullRecipe extends React.Component {
  constructor() {
    super();
    // this.state = {
    //   deleted: [],
    //   editRecipe: [],
    //   editable: '',
    //   editID: [],
    //   canEdit: false,
    // }
    // this.updateRecipe = this.updateRecipe.bind(this);
    // this.getRecipe = this.getRecipe.bind(this);
    // this.onEdit = this.onEdit.bind(this);
    // this.onCancel = this.onCancel.bind(this);
    // this.onDelete = this.onDelete.bind(this);
    // this.onArraySubmit = this.onArraySubmit.bind(this);
    // this.onEditSubmit = this.onEditSubmit.bind(this);
  }


  render() {
      const recipes = this.props.recipes;
      const title = this.props.match.params.title;
      console.log(title);
      const rec = recipes.filter(rec => {
        if(rec.title.split(' ').join('') === title) {
            return rec;
        }});

        const List = rec.map((recipe) => {
          return (

            <div key={recipe.id}>
              <div className="fullRecipe">
                <div className="fullRecipe--tBlock">
                  <div className="fullRecipe--tBlock-box">
                    <div className="titleBox">
                      <h3>{recipe.title}</h3>
                      <p><span>Category</span><span>{recipe.category}</span></p>
                      {recipe.recipeTime && <p><span>Time to Cook</span><span>{recipe.recipeTime}</span></p>}
                      {recipe.link && <a href={recipe.link}>Link to Original Recipe</a>}
                      <p>{recipe.notes}</p>
                      <AuthUserContext.Consumer>
                      { authUser => authUser && this.props.user === recipe.user &&
                          <div className="fullRecipe--edit">
                            <Link to={ `/${title.split(' ').join('')}-edit` }>
                            <button onClick={() => this.props.getRecipe(recipe.id)}>
                                  Edit
                            </button>
                            </Link>

                          </div>
                      }
                      </AuthUserContext.Consumer>
                    </div>
                  </div>
                  {recipe.imageURL ?
                    <div className="fullRecipe--tBlock-image" style= { {
                      backgroundImage:
                      `url(${recipe.imageURL })` } }>
                    </div>
                    :
                    <div className="fullRecipe--tBlock-image" style= { {
                      backgroundColor:
                      `#627bc0` } }>
                        <h3>No Image Available</h3>
                    </div>
                  }
                </div>
                <div  className="fullRecipe--bBlock">
                    <div className="fullRecipe--bBlock-ingredients">
                      <h3>Ingredients</h3>
                      {recipe.ingredients.map(ingredient =>
                        <p key = {ingredient.id}>{ingredient.content}</p>
                      )}
                    </div>
                    <div className="fullRecipe--bBlock-steps">
                      <h3>Steps</h3>
                      {recipe.steps.map((step, index) =>
                        <p key = {step.id}><span>{index + 1}.</span> {step.content}</p>
                      )}
                    </div>
                </div>
              </div>

            </div>
        )
    })
    return (

        <Transition
          items={List}
          from={{ transform: 'translate3d(0,60px,0)', opacity: 0 }}
          enter={{ transform: 'translate3d(0,0px,0)', opacity: 1 }}
          leave={{ transform: 'translate3d(0,-60px,0)', opacity: 0 }}>
          {List =>
            List && (
              props =>

                <div style={props}>{List}</div>
              )
          }

        </Transition>
    )
  }
}
FullRecipe.propTypes = {
  recipes: PropTypes.array,
  title: PropTypes.object,
  recipe: PropTypes.arrayOf(PropTypes.string)
}

export default withEditContext(FullRecipe);

// items={List}
//           // from={{transform: 'translate3d(0,60px,0)', opacity: 0 }}
//           // to={{ transform: 'translate3d(0,0px,0)', opacity: 1 }}
//           from={{ position: 'absolute', opacity: 0 }}
//           enter={{ opacity: 1 }}
//           leave={{ opacity: 0 }}>
//         >
//           {({ transform, opacity }) => <div style={{ transform, opacity }}>{List}</div>}

// const name = rec.map(r => r.title);
//       const Ingredients = rec.map(r => r.ingred.map(food =>
//           <p key = {food.id}>{food.text}</p>
//         )
//       )
//       const steps = rec.map(r => r.steps);
//       console.log(name);




 // const recipes = this.props.recipes;
 //      const title = this.props.match.params.title;
 //      function Search (id) {
 //        const isRecipe = r => r.title === id
 //        return recipes.find(isRecipe)
 //      }
 //      const rec = recipes.Search(title);



// function get (recipe) {
//     const isRecipe = r => r.title === recipe
//     return {props.recipes.find(isRecipe)}
//   }
//     const recipe = get(props.match.params.title);
//         if (!recipe) {
//           return <div>Sorry, but the recipe was not found</div>
//         }