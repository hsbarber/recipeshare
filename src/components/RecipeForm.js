import React from 'react';
import PropTypes from 'prop-types';
import CategoryAPI from '../categories'
import ImageUpload from './ImageUpload.js';
import ListForm from './ListForm.js';
import PrintCurrentList from './PrintCurrentList.js';
import FormErrors from './FormErrors.js';
import AnimateHeight from 'react-animate-height';
import ChevronDown from '../icons/ChevronDown.js';
import Remove from '../icons/Remove.js';

function RecipeForm (props) {
  const CategoryShift = CategoryAPI.all().slice(1);
  const CategorySelect = CategoryShift.map((category, index) => {
    return <option key={index} value={category}><h5>{category}</h5></option>
  })


  return (
    <div>
      <div className="recipeIntro">
        <h1>Create a Recipe</h1>
        <div className="collapse" onClick={props.toggleCollapse}>
          {props.collapse ? <span><h3>Open Recipe Form </h3><ChevronDown /></span>  : <span><h3>Close Recipe Form </h3><Remove /></span> }
        </div>
      </div>
      <main className="recipeForm">
        <AnimateHeight
          duration={ 500 }
          height={props.collapse ? "0" : "auto"}
        >
          <form className="recipeForm--Background" onSubmit={props.handleSubmit}>
              <FormErrors formErrors={props.formErrors} />
              <div className="titleWrapper">
                <input className="title" type="text" name="title" placeholder="What's the title of your recipe?" onChange={(e) => props.handleChange(e)} value={props.title}/>
              </div>
              <ImageUpload {...props} />
              <div className="chooseCategory">
                <h4>Choose a recipe category</h4>
                <select value={props.category} onChange={props.handleSelect}>
                  <option defaultValue="American">American</option>
                  {CategorySelect}
                </select>
              </div>
              <ListForm {...props} name="ingredient"/>
              <PrintCurrentList
                {...props}
                list={props.ingredients}
                name='ingredients'
              />
              <ListForm {...props} name="step"/>
              <PrintCurrentList
                {...props}
                list={props.steps}
                name='steps'
              />
              <button disabled={!props.formValid}>Add Recipe</button>

          </form>

        </AnimateHeight>
      </main>
    </div>
  )
}
RecipeForm.PropTypes = {
  toggleCollapse: PropTypes.func,
  collapse: PropTypes.bool,
  handleSubmit: PropTypes.func,
  formErrors: PropTypes.objectOf(PropTypes.string),
  handleChange: PropTypes.func,
  title:PropTypes.string,
  category: PropTypes.string,
  handleSelect: PropTypes.func,
  ingredients: PropTypes.array,
  steps: PropTypes.array,
  formValid: PropTypes.bool,
}
export default RecipeForm;
