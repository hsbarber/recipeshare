import React from 'react';
import CategoryAPI from '../categories'
import ImageUpload from './ImageUpload.js';
import ListForm from './ListForm.js';
import PrintCurrentList from './PrintCurrentList.js';
import FormErrors from './FormErrors.js';
import AnimateHeight from 'react-animate-height';
import ChevronDown from '../img/chevron-down.svg';
import Remove from '../img/remove.svg';

function RecipeForm (props) {
  const CategoryShift = CategoryAPI.all().slice(1);
  const CategorySelect = CategoryShift.map((category, index) => {
    return <option key={index} value={category}><h5>{category}</h5></option>
  })


  return (
    <div className='recipeForm'>
        <h2>Create a Recipe</h2>
        <div className="collapse" onClick={props.toggleCollapse}>
          {props.collapse ? <h3>Open Recipe Form <img src={ChevronDown} alt="down"/></h3>  : <h3>Close Recipe Form <img src={Remove} alt="remove"/></h3> }
        </div>
        <AnimateHeight
          duration={ 500 }
          height={props.collapse ? "0" : "auto"}
        >
        <form onSubmit={props.handleSubmit}>

            <FormErrors formErrors={props.formErrors} />
            <div className="titleWrapper">
              <input className="title" type="text" name="title" placeholder="What's the title of your recipe?" onChange={(e) => props.handleChange(e)} value={props.title}/>
            </div>
            <ImageUpload {...props} />
            <div className="chooseCategory">
              <h3>Choose a recipe category</h3>
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
    </div>
  )
}

export default RecipeForm;
