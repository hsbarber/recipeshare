import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Spring }  from 'react-spring'
import AuthUserContext from './AuthUserContext';
import CategoryAPI from '../categories'
import ImageUpload from './ImageUpload.js';
import ListForm from './ListForm.js';
import PrintList from './PrintList.js';
import AnimateHeight from 'react-animate-height';
import ChevronDown from '../icons/ChevronDown.js';
import Remove from '../icons/Remove.js';

function RecipeForm (props) {
  const CategoryShift = CategoryAPI.all().slice(1);
  const CategorySelect = CategoryShift.map((category, index) => {
    return <option key={index} value={category.text}>{category.text}</option>
  })
  const recipeTime = [
		{text: "Short - less than 1 hour"},
		{text: "Average - less than 2 hours"},
    {text: "Long - over 2 hours"}
  ];
  const recipeTimeSelect = recipeTime.slice(1).map((time, index) => {
    return <option key={index} value={time.text}>{time.text}</option>
  })
    return (
    <div>


        <div className="recipeIntro">
          <Spring
            from={{ transform: 'translate3d(0,60px,0)', opacity: 0 }}
            to={{transform: 'translate3d(0,0,0)', opacity: 1 }}
          >
          {props =>
            <div className="recipeIntro-title" style={props}>
              <h2>Build a</h2>
              <h1>Recipe</h1>
            </div>
          }
          </Spring>
          <div className="recipeIntro-Options">
          <AuthUserContext.Consumer>
            {authUser => authUser ?
              <div className="collapse" >
                {props.collapse ? <span onClick={props.toggleCollapse}><h3>Open Recipe Form </h3><ChevronDown /></span>  : <span onClick={props.toggleCollapse}><h3>Close Recipe Form </h3><Remove /></span> }
              </div>
              : <h3><Link to={'/signin'}>Sign In</Link> or <Link to={'/signup'}>Sign Up</Link> to Build a Recipe</h3>
            }
            </AuthUserContext.Consumer>
          </div>
        </div>

      <section className="rForm">
        <AnimateHeight
          duration={ 500 }
          height={props.collapse ? "0" : "auto"}
        >
         <form className="rForm--bg"  onSubmit={props.handleSubmit}>
              <div className="rForm--input">
                <input className="title" type="text" name="title" placeholder="What's the title of your recipe?" onChange={(e) => props.handleChange(e)} value={props.title}/>
              </div>
              <div className="errorMsg">{props.errors.title}</div>
              <ImageUpload {...props} />
              <div className="rForm--select">
                <h4>Choose a recipe category</h4>
                <select value={props.category}  onChange={(e) => props.handleSelect(e, "category")}>
                  <option defaultValue="American">American</option>
                  {CategorySelect}
                </select>
              </div>
              <div className="rForm--select">
                <h4>Choose a an approximate time to make</h4>
                <select value={props.recipeTime} onChange={(e) => props.handleSelect(e, "recipeTime")}>
                  <option defaultValue="Short - less than 1 hour">Short - less than 1 hour</option>
                  {recipeTimeSelect}
                </select>
              </div>
              <div className="rForm--input-vertical">
                <h4>Add any Recipe Notes</h4>
                <textarea  name="notes" value={props.notes} onChange={(e) => props.handleChange(e)}/>
              </div>
              <div className="rForm--input-vertical">
                <h4>Add a link to original recipe</h4>
                <input name="link" value={props.link} onChange={(e) => props.handleChange(e)}/>
              </div>
              <div className="rForm--input-vertical">
                <h4>Add your ingredients</h4>
                <ListForm
                  addItemArray={props.addItemArray}
                  inputName="ingredient"
                />
                <div className="errorMsg">{props.errors.ingredients}</div>
                <PrintList
                  list={props.ingredients}
                  dragEnd={props.onDragEnd}
                  remove={props.remove}
                  name="ingredients"
                />
              </div>
              <div className="rForm--input-vertical">
                <h4>Add the steps to your recipe</h4>
                <ListForm
                  addItemArray={props.addItemArray}
                  inputName="step"
                />
                <div className="errorMsg">{props.errors.steps}</div>
                <PrintList
                  list={props.steps}
                  dragEnd={props.onDragEndSteps}
                  remove={props.remove}
                  name="steps"
                />
              </div>
              <AnimateHeight
                duration={ 500 }
                height={props.errorAnimate ? "auto" : 0}
              >
              {props.errorAnimate && <div className="errorMsg--form">{props.errors.form}</div>}
              </AnimateHeight>
              <button className="submit">Add Recipe</button>
          </form>

        </AnimateHeight>
      </section>
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
