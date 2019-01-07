import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import FileUploader from 'react-firebase-file-uploader';
import CategoryAPI from '../categories';
import firebase from '../firebase/firebase';

const recipeTime = [
  { text: 'Short - less than 1 hour' },
  { text: 'Average - less than 2 hours' },
  { text: 'Long - over 2 hours' },
];
// creates the recipe time select button
const recipeTimeSelect = recipeTime.slice(1).map((time, index) => (
  <option key={index} value={time.text}>
    {time.text}
  </option>
));
// creates the category select button
const CategoryShift = CategoryAPI.all().slice(1);
const CategorySelect = CategoryShift.map((category, index) => (
  <option key={index} value={category.text}>
    {category.text}
  </option>
));
class EditForm extends Component {
  constructor() {
    super();
    this.state = {
      deleted: [],
      editRecipe: [],
      canEdit: false,
      editID: [],
    };
    this.inputRefs = [];
    this.deleteList = this.deleteList.bind(this);
    this.updateRecipe = this.updateRecipe.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onArraySubmit = this.onArraySubmit.bind(this);
    this.onEditSubmit = this.onEditSubmit.bind(this);
  }

  componentWillMount() {
    const { recipes, match } = this.props;
    const { title } = match.params;
    // filter recipes array to only be the array with same title as router title
    const findRecipe = recipes.filter(recipe =>
      recipe.title.replace(/\s/g, '') === title ? recipe : null
    );
    // create a deep copy  of the findRecipe array
    const newRecipe = JSON.parse(JSON.stringify(findRecipe));
    // set state of editRecipe to copied array
    this.setState({
      editRecipe: newRecipe,
      canEdit: true,
    });
  }

  componentDidMount() {
    this.hydrateStateWithLocalStorage();
  }

  componentWillUnmount() {
    window.removeEventListener(
      'beforeunload',
      this.saveStateToLocalStorage.bind(this)
    );

    // saves if component has a chance to unmount
    this.saveStateToLocalStorage();
  }

  onEdit(id) {
    // on clicking the edit button, take the passed id
    // and put it into the editArray
    const { editID } = this.state;
    const editArray = editID;
    editArray.push(id);
    this.setState({ editID: editArray });
  }

  onEditSubmit(e, id, value, name) {
    e.preventDefault();
    const editRecipe = this.state;
    let recipes = editRecipe;
    // Find the right recipe in the array of recipes with an id and
    // then assign the recipe's property the new value
    recipes = recipes.map(recipe => {
      if (recipe.id === id) {
        recipe[name] = value;
      }
      return recipe;
    });
    this.removeID(name);
    // update the state of recipes array with new value

    this.setState({ editRecipe: recipes });
  }

  onArraySubmit(e, itemID, value, name) {
    e.preventDefault();
    const { editRecipe } = this.state;
    // filter editRecipe array so that if the right ingredient or step is found
    // make the content the passed in value
    const saved = editRecipe[0][name].filter(item => {
      if (item.id === itemID) {
        item.content = value;
      }
      return item;
    });
    // remove list item from save state (remove from editArray)
    this.removeID(itemID);

    // modify the editRecipe array with saved values
    this.setState({ ...editRecipe, saved });
  }

  onCancel(e, name) {
    e.preventDefault();
    this.removeID(name);
  }

  onDelete(e, itemID, name) {
    e.preventDefault();
    const { editRecipe } = this.state;
    // find the right item in the ingredients or steps array by passing in the itemID
    const index = editRecipe[0][name].map(item => item.id).indexOf(itemID);
    // if the item is found, use splice to cut out the matching item
    // from the ingredients or steps array
    // then setState of the edit array with the modifications
    if (index !== -1) {
      const rm = editRecipe[0][name].splice(index, 1);
      this.setState({ ...editRecipe, rm });
    }
    this.removeID(itemID);
  }

  removeID(name) {
    // this function filters the editID array to form a new
    // array without the item clicked. Then, the editID state
    // updated with a new state
    const editID = this.state;
    const editArray = [...editID];
    const remove = editArray.filter(e => e !== name);
    this.setState({ editID: remove });
  }

  updateRecipe(e, id) {
    e.preventDefault();
    const { editRecipe } = this.state;
    return (
      firebase
        .database()
        .ref(`/recipes/${id}`)
        .set(editRecipe[0]),
      this.setState({
        canEdit: false,
      }),
      alert('Updates submitted')
    );
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
    // for (const key in this.state) {
    //   localStorage.setItem(key, JSON.stringify(this.state[key]));
    // }
  }

  deleteList(id) {
    const { deleted } = this.state;
    const newDelete = deleted;
    newDelete.push(id);
    console.log(newDelete);
    this.setState({ deleted: newDelete });
  }

  render() {
    const {
      updateRecipe,
      onEdit,
      onEditSubmit,
      onCancel,
      onDelete,
      onArraySubmit,
      deleteList,
    } = this;
    const { editRecipe, editID, deleted } = this.state;
    const {
      history,
      category,
      handleSelect,
      recipeTime,
      isUploading,
      progress,
      imageURL,
      handleUploadStart,
      handleUploadError,
      handleUploadSuccess,
      handleProgress,
    } = this.props;
    return editRecipe.map(recipe => (
      <div className="update-form--container" key={recipe.id}>
        <div className="update-form--header">
          <h2>Update the Recipe</h2>
          {/* Cancel Button - returns to recipe */}
          <Link
            className="cancel-Update"
            to={`/${recipe.title.split(' ').join('')}`}
          >
            <button type="button" className="submit">
              Cancel
            </button>
          </Link>
        </div>
        <form
          className="update-form"
          onSubmit={e => {
            history.push(`/${recipe.title.split(' ').join('')}`);
            updateRecipe(e, recipe.id);
          }}
        >
          {/* TITLE UPDATE */}
          <div className="editRecipe-Column">
            {editID.indexOf('title') > -1 ? (
              <div>
                <input
                  ref={node => {
                    this.input1 = node;
                  }}
                  placeholder={recipe.title}
                  defaultValue={recipe.title}
                />
                <div>
                  <button
                    type="button"
                    onClick={e => {
                      onEditSubmit(e, recipe.id, this.input1.value, 'title');
                    }}
                  >
                    save
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={e => {
                      e.preventDefault();
                      onCancel(e, 'title');
                    }}
                  >
                    cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p>
                  <span>Title</span>: {recipe.title}
                </p>
                <div>
                  <button
                    type="button"
                    onClick={e => {
                      e.preventDefault();
                      onEdit('title');
                    }}
                  >
                    edit
                  </button>
                </div>
              </div>
            )}
            {/* CATEGORY UPDATE */}
            <div className="select">
              <div>
                <p>
                  <span>Category</span>: {recipe.category}
                </p>
              </div>
              <div>
                <select
                  value={category}
                  onChange={e => handleSelect(e, 'category')}
                >
                  <option defaultValue="American">American</option>
                  {CategorySelect}
                </select>
              </div>
              <div>
                <button
                  type="button"
                  onClick={e => {
                    onEditSubmit(e, recipe.id, category, 'category');
                  }}
                >
                  save
                </button>
              </div>
            </div>
            {/* RECIPE TIME UPDATE */}
            {recipe.recipeTime && (
              <div className="select">
                <div>
                  <p>
                    <span>Time to Make</span>: {recipe.recipeTime}
                  </p>
                </div>
                <div>
                  <select
                    value={recipeTime}
                    onChange={e => handleSelect(e, 'recipeTime')}
                  >
                    <option defaultValue="Short - less than 1 hour">
                      Short - less than 1 hour
                    </option>
                    {recipeTimeSelect}
                  </select>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={e => {
                      onEditSubmit(e, recipe.id, recipeTime, 'recipeTime');
                    }}
                  >
                    save
                  </button>
                </div>
              </div>
            )}
            {/* LINK UPDATE */}
            {editID.indexOf('link') > -1 ? (
              <div>
                <input
                  ref={node => {
                    this.input2 = node;
                  }}
                  placeholder={recipe.link}
                  defaultValue={recipe.link}
                />
                <div>
                  <button
                    type="button"
                    onClick={e => {
                      onEditSubmit(e, recipe.id, this.input2.value, 'link');
                    }}
                  >
                    save
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={e => {
                      e.preventDefault();
                      onCancel(e, 'link');
                    }}
                  >
                    cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p>
                  <span>Link to Original Recipe</span>: {recipe.link}
                </p>
                <div>
                  <button
                    type="button"
                    onClick={e => {
                      e.preventDefault();
                      onEdit('link');
                    }}
                  >
                    edit
                  </button>
                </div>
              </div>
            )}
            {/* NOTES UPDATE */}
            {editID.includes('notes') ? (
              <div>
                <textarea
                  ref={node => {
                    this.input3 = node;
                  }}
                  placeholder={recipe.notes}
                  defaultValue={recipe.notes}
                />
                <div>
                  <button
                    type="button"
                    onClick={e => {
                      onEditSubmit(e, recipe.id, this.input3.value, 'notes');
                    }}
                  >
                    save
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={e => {
                      e.preventDefault();
                      onCancel(e, 'notes');
                    }}
                  >
                    cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p>
                  <span>Notes</span>: {recipe.notes}
                </p>
                <div>
                  <button
                    type="button"
                    onClick={e => {
                      e.preventDefault();
                      onEdit('notes');
                    }}
                  >
                    edit
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* END COLUMN */}

          {/* IMAGE UPDATE */}
          <div className="editRecipe--block">
            <h3>Image</h3>
            <div className="editRecipe-selectedIMG">
              {recipe.imageURL ? (
                <div className="editRecipe-image">
                  <p>
                    <span>Current Image:</span>
                  </p>
                  <img src={recipe.imageURL} alt="recipe" />
                </div>
              ) : (
                <div
                  className="editRecipe-image"
                  style={{
                    backgroundColor: `#627bc0`,
                  }}
                >
                  <h3>No Image Available</h3>
                </div>
              )}
            </div>
            <div className="editRecipe-Column--Image">
              <div>
                {isUploading && (
                  <div>
                    <p>Progress: {progress} </p>
                  </div>
                )}
                {imageURL ? (
                  <div>
                    {' '}
                    <img src={imageURL} alt="imageUpload" />
                  </div>
                ) : (
                  <h4>Selected Image</h4>
                )}
                <div>
                  <FileUploader
                    accept="image/*"
                    name="image"
                    randomizeFilename
                    storageRef={firebase.storage().ref('images')}
                    onUploadStart={handleUploadStart}
                    onUploadError={handleUploadError}
                    onUploadSuccess={handleUploadSuccess}
                    onProgress={handleProgress}
                  />
                </div>
                <div>
                  <p className="update-image-note">
                    *Image looks best at width of 1200px or larger
                  </p>
                  <button
                    type="button"
                    onClick={e => {
                      onEditSubmit(e, recipe.id, imageURL, 'imageURL');
                    }}
                  >
                    save
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="editRecipe--block">
            <h3>Ingredients</h3>
            <div className="editRecipe-Column--List">
              {recipe.ingredients.map((ingredient, index) =>
                editID.includes(ingredient.id) ? (
                  <div key={ingredient.id}>
                    <input
                      key={index}
                      ref={ref => {
                        this.inputRefs[index] = ref;
                      }}
                      defaultValue={ingredient.content}
                      placeholder={ingredient.content}
                    />
                    <div>
                      <button
                        type="button"
                        onClick={e =>
                          onArraySubmit(
                            e,
                            ingredient.id,
                            this.inputRefs[index].value,
                            'ingredients'
                          )
                        }
                      >
                        save
                      </button>
                      <button
                        type="button"
                        onClick={e => onCancel(e, ingredient.id)}
                      >
                        cancel
                      </button>
                      <button
                        type="button"
                        className="delete"
                        onClick={e => {
                          deleteList(ingredient.id);
                          onDelete(e, ingredient.id, 'ingredients');
                        }}
                      >
                        delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <div key={ingredient.id}>
                    <p>
                      {deleted.includes(ingredient.id)
                        ? 'item deleted'
                        : ingredient.content}
                    </p>
                    <div>
                      <button
                        type="button"
                        onClick={e => {
                          e.preventDefault();
                          onEdit(ingredient.id);
                        }}
                      >
                        edit
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
          <div className="editRecipe--block">
            <h3>Steps</h3>
            <div className="editRecipe-Column--List">
              {recipe.steps.map((step, index) =>
                editID.includes(step.id) ? (
                  <div key={step.id}>
                    <textarea
                      key={index}
                      ref={ref => {
                        this.inputRefs[index] = ref;
                      }}
                      defaultValue={step.content}
                      placeholder={step.content}
                    />
                    <div>
                      <button
                        type="button"
                        onClick={e =>
                          onArraySubmit(
                            e,
                            step.id,
                            this.inputRefs[index].value,
                            'steps'
                          )
                        }
                      >
                        save
                      </button>
                      <button type="button" onClick={e => onCancel(e, step.id)}>
                        cancel
                      </button>
                      <button
                        type="button"
                        className="delete"
                        onClick={e => onDelete(e, step.id, 'steps')}
                      >
                        delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <div key={step.id}>
                    <p>
                      <span>{index + 1}.</span> {step.content}
                    </p>
                    <div>
                      <button
                        type="button"
                        onClick={e => {
                          e.preventDefault();
                          onEdit(step.id);
                        }}
                      >
                        edit
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
          <div className="submit-Block">
            <h4>Submit the Updates:</h4>{' '}
            <button type="button" className="submit">
              submit
            </button>
          </div>
        </form>
      </div>
    ));
  }
}

export default EditForm;

EditForm.propTypes = {
  recipes: PropTypes.instanceOf(Array),
  match: PropTypes.object,
  history: PropTypes.object,
  category: PropTypes.string,
  recipeTime: PropTypes.string,
  handleSelect: PropTypes.func,
  isUploading: PropTypes.bool,
  progress: PropTypes.number,
  imageURL: PropTypes.string,
  handleUploadStart: PropTypes.func,
  handleUploadError: PropTypes.func,
  handleUploadSuccess: PropTypes.func,
  handleProgress: PropTypes.func,
};
