import React from 'react';
import PropTypes from 'prop-types';
import CategoryAPI from '../categories'
import ImageUpload from './ImageUpload.js';
import ListForm from './ListForm.js';
import PrintList from './PrintList.js';
import FormErrors from './FormErrors.js';
import AnimateHeight from 'react-animate-height';
import ChevronDown from '../icons/ChevronDown.js';
import Remove from '../icons/Remove.js';

function RecipeForm (props) {
  const CategoryShift = CategoryAPI.all().slice(1);
  const CategorySelect = CategoryShift.map((category, index) => {
    return <option key={index} value={category}>{category}</option>
  })

    return (
    <div>
      <div className="recipeIntro">
        <h1>Create a Recipe</h1>
        <div className="collapse" >
          {props.collapse ? <span onClick={props.toggleCollapse}><h3>Open Recipe Form </h3><ChevronDown /></span>  : <span onClick={props.toggleCollapse}><h3>Close Recipe Form </h3><Remove /></span> }
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
              <div className="ingredientsWrapper">
                <h4>Add your ingredients</h4>
                <ListForm
                  addItemArray={props.addItemArray}
                  checkButton={props.checkButton}
                  inputName="ingredient"
                  buttonValid={props.ingredientsValid}
                />
                <PrintList
                  list={props.ingredients}
                  dragEnd={props.onDragEnd}
                  remove={props.remove}
                  name="ingredients"
                />
              </div>
              <div className="stepsWrapper">
                <h4>Add the steps to your recipe</h4>
                <ListForm
                  addItemArray={props.addItemArray}
                  checkButton={props.checkButton}
                  inputName="step"
                  buttonValid={props.stepsValid}
                />
                <PrintList
                  list={props.steps}
                  dragEnd={props.onDragEndSteps}
                  remove={props.remove}
                  name="steps"
                />
              </div>
              <button disabled={!props.formValid}>Add Recipe</button>

          </form>

        </AnimateHeight>
      </main>
    </div>
    )
}
RecipeForm.propTypes = {
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
export default RecipeForm
