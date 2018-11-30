import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom';
import withCorrectAccount from './withCorrectAccount';
import { Transition }  from 'react-spring'
import CategoryAPI from '../categories'
import FileUploader from 'react-firebase-file-uploader';
import firebase from '../firebase/firebase'
import { doPasswordUpdate } from '../firebase/auth';

const recipeTime = [
    {text: "Short - less than 1 hour"},
    {text: "Average - less than 2 hours"},
    {text: "Long - over 2 hours"}
];
// creates the recipe time select button
const recipeTimeSelect = recipeTime.slice(1).map((time, index) => {
    return <option key={index} value={time.text}>{time.text}</option>
})
//creates the category select button
const CategoryShift = CategoryAPI.all().slice(1);
const CategorySelect = CategoryShift.map((category, index) => {
return <option key={index} value={category.text}>{category.text}</option>
})
class Edit extends React.Component {
    constructor() {
      super();
	    this.state = {
            deleted: [],
            editRecipe: [],
            editable: '',
            canEdit: false,
        }
        this.inputRefs = [];
        this.deleteList = this.deleteList.bind(this);
    }
    componentDidMount(props) {
        this.props.recipes.filter(rec => {
            if(rec.user === this.props.user)
                this.setState({canEdit: true});
        });
    }
    deleteList(id) {
        let newDelete = this.state.deleted;
        newDelete.push(id);
        console.log(newDelete);
        this.setState({deleted: newDelete});
    }
    // getRecipe () {
    //     const title = this.props.match.params.title;
	// 	const recipes = this.props.recipes;
	// 	const filterRecipes = recipes.filter(recipe => {
	// 		if (recipe.title.split(' ').join('') === title) {
	// 			return recipe
	// 		}
	// 	})
	// 	//this will make a deep copy of the filterRecipes array, so there is not a reference to recipes array
	// 	const newRecipe = JSON.parse(JSON.stringify(filterRecipes ));
	// 	console.log(newRecipe);
	// 	this.setState({
	// 		editRecipe: newRecipe,
	// 		editable: title,
	// 		canEdit: !this.state.canEdit
	// 	});
    // }


    render() {
        // let newRecipe = [];
        // const recipes = this.props.recipes.filter((recipe) => {
        //     if (recipe.id === this.props.editable)
        //     return recipe
        // })
        // newRecipe = recipes;

        const title = this.props.match.params.title;
        //console.log(title);
        const findRecipe = this.props.editRecipe.filter(rec => {
            if(rec.title.split(' ').join('') === title) {
                return rec;
        }});

         const form = this.props.editRecipe.map((recipe) => {
            return (

                <div className="update-form--container" key={recipe.id}>
                    <div className="update-form--header">
                        <h2>Update the Recipe</h2>
                        {/* Cancel Button - returns to recipe */}
                        <Link className="cancel-Update" to={`/${recipe.title.split(' ').join('')}`}>
                            <button className="submit">Cancel</button>
                        </Link>
                    </div>
                    <form className="update-form" onSubmit={(e) => {this.props.history.push(`/${recipe.title.split(' ').join('')}`); this.props.updateRecipe(e, recipe.id)}}>

                        {/* TITLE UPDATE */}
                        <div className="editRecipe-Column">
                            {this.props.editID.indexOf("title") > -1 ?
                                <div>
                                    <input ref={node => {this.input1 = node}} placeholder={recipe.title} defaultValue={recipe.title}/>
                                    <div>
                                        <button onClick={(e) => {
                                            this.props.onEditSubmit(e, recipe.id, this.input1.value, "title");
                                        }}>save</button>
                                    </div>
                                    <div>
                                        <button onClick={(e) => {e.preventDefault();
                                            this.props.onCancel(e, "title");
                                        }}>cancel</button>
                                    </div>
                                </div>
                                :
                                <div>
                                    <p><span>Title</span>: {recipe.title}</p>
                                   <div>
                                    <button onClick={(e) => {e.preventDefault();
                                        this.props.onEdit("title");
                                    }}>edit</button>
                                   </div>
                                </div>
                            }
                            {/* CATEGORY UPDATE */}
                            <div className="select">
                                <div><p><span>Category</span>: {recipe.category}</p></div>
                                <div>
                                    <select value={this.props.category}  onChange={(e) => this.props.handleSelect(e, "category")}>
                                        <option defaultValue="American">American</option>
                                        {CategorySelect}
                                    </select>
                                </div>
                                <div>
                                    <button onClick={(e) => {
                                            this.props.onEditSubmit(e, recipe.id, this.props.category, "category");
                                        }}>save
                                    </button>
                                </div>
                            </div>
                            {/* RECIPE TIME UPDATE */}
                            {recipe.recipeTime && <div className="select">
                                <div><p><span>Time to Make</span>: {recipe.recipeTime}</p></div>
                                <div>
                                    <select value={this.props.recipeTime}  onChange={(e) => this.props.handleSelect(e, "recipeTime")}>
                                        <option defaultValue="Short - less than 1 hour">Short - less than 1 hour</option>
                                        {recipeTimeSelect}
                                    </select>
                                </div>
                                <div>
                                    <button onClick={(e) => {
                                            this.props.onEditSubmit(e, recipe.id, this.props.recipeTime, "recipeTime");
                                        }}>save
                                    </button>
                                </div>
                            </div>}
                            {/* LINK UPDATE */}
                            {this.props.editID.indexOf("link") > -1 ?
                            <div>
                                <input ref={node => {this.input2 = node}} placeholder={recipe.link} defaultValue={recipe.link}/>
                                <div>
                                    <button onClick={(e) => {
                                        this.props.onEditSubmit(e, recipe.id, this.input2.value, "link");
                                    }}>save</button>
                                </div>
                                <div>
                                    <button onClick={(e) => {e.preventDefault();
                                        this.props.onCancel(e, "link");
                                    }}>cancel</button>
                                </div>
                            </div>
                            :
                            <div>
                                <p><span>Link to Original Recipe</span>: {recipe.link}</p>
                                <div>
                                    <button onClick={(e) => {e.preventDefault();
                                        this.props.onEdit("link");
                                    }}>edit</button>
                                </div>
                            </div>
                            }
                            {/* NOTES UPDATE */}
                            {this.props.editID.includes("notes") ?
                            <div>
                                <textarea ref={node => {this.input3 = node}} placeholder={recipe.notes} defaultValue={recipe.notes}/>
                                <div>
                                    <button onClick={(e) => {
                                        this.props.onEditSubmit(e, recipe.id, this.input3.value, "notes");
                                    }}>save</button>
                                </div>
                                <div>
                                    <button onClick={(e) => {e.preventDefault();
                                        this.props.onCancel(e, "notes");
                                    }}>cancel</button>
                                </div>
                            </div>
                            :
                            <div>
                                <p><span>Notes</span>: {recipe.notes}</p>
                                <div>
                                    <button onClick={(e) => {e.preventDefault();
                                        this.props.onEdit("notes");
                                    }}>edit</button>
                                </div>
                            </div>
                            }
                        </div>
                        {/* END COLUMN */}


                        {/* IMAGE UPDATE */}
                        <div  className="editRecipe--block">
                            <h3>Image</h3>
                            <div className="editRecipe-selectedIMG">
                                {recipe.imageURL ?
                                        <div className="editRecipe-image" >
                                            <p><span>Current Image:</span></p><img src={recipe.imageURL} alt="recipe image"/>
                                        </div>
                                        :
                                        <div className="editRecipe-image" style= { {
                                        backgroundColor:
                                        `#627bc0` } }>
                                            <h3>No Image Available</h3>
                                        </div>
                                }
                            </div>
                            <div className="editRecipe-Column--Image">
                                <div>
                                    {this.props.isUploading &&
                                    <div><p>Progress: {this.props.progress}</p></div>
                                    }
                                    {this.props.imageURL ?
                                        <div> <img src={this.props.imageURL} alt="imageUpload"/></div>
                                        : <h4>Selected Image</h4>
                                    }
                                    <div>
                                        <FileUploader
                                            accept="image/*"
                                            name="image"
                                            randomizeFilename
                                            storageRef={firebase.storage().ref('images')}
                                            onUploadStart={this.props.handleUploadStart}
                                            onUploadError={this.props.handleUploadError}
                                            onUploadSuccess={this.props.handleUploadSuccess}
                                            onProgress={this.props.handleProgress}
                                        />
                                    </div>
                                    <div>
                                        <p className="update-image-note">*Image looks best at width of 1200px or larger</p>
                                        <button onClick={(e) => {
                                            this.props.onEditSubmit(e, recipe.id, this.props.imageURL, "imageURL");
                                        }}>save</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div  className="editRecipe--block">
                        <h3>Ingredients</h3>
                            <div className="editRecipe-Column--List">
                                {recipe.ingredients.map((ingredient, index) =>
                                    this.props.editID.includes(ingredient.id) ?
                                    <div key = {ingredient.id}>
                                        <input  key={index} ref={(ref) => this.inputRefs[index] = ref} defaultValue={ingredient.content} placeholder={ingredient.content}/>
                                        <div>
                                            <button onClick={(e) => this.props.onArraySubmit(e, recipe.id, ingredient.id, this.inputRefs[index].value, "ingredients")}>
                                                save
                                            </button>
                                            <button onClick={(e) => this.props.onCancel(e, ingredient.id)}>
                                                cancel
                                            </button>
                                                <button className="delete" onClick={(e) => {this.deleteList(ingredient.id); this.props.onDelete(e, recipe.id, ingredient.id, "ingredients")}}>
                                                delete
                                            </button>
                                        </div>
                                    </div> :
                                    <div key = {ingredient.id}>
                                        <p>{this.state.deleted.includes(ingredient.id) ? "item deleted" : ingredient.content}</p>
                                        <div>
                                            <button onClick={(e) => {e.preventDefault();
                                                this.props.onEdit(ingredient.id);
                                            }}>edit</button>
                                        </div>
                                    </div>

                                )}
                            </div>
                        </div>
                        <div className="editRecipe--block">
                        <h3>Steps</h3>
                            <div className="editRecipe-Column--List">
                                {recipe.steps.map((step, index) =>
                                    this.props.editID.includes(step.id) ?
                                    <div key = {step.id}>
                                        <textarea  key={index} ref={(ref) => this.inputRefs[index] = ref} defaultValue={step.content} placeholder={step.content}/>
                                        <div>
                                            <button onClick={(e) => this.props.onArraySubmit(e, recipe.id, step.id, this.inputRefs[index].value, "steps")}>
                                                save
                                            </button>
                                            <button onClick={(e) => this.props.onCancel(e, step.id)}>
                                                cancel
                                            </button>
                                            <button className="delete" onClick={(e) => this.props.onDelete(e, recipe.id, step.id, "steps")}>
                                                delete
                                            </button>
                                        </div>
                                    </div> :
                                    <div key = {step.id}>
                                        <p><span>{index + 1}.</span> {step.content}</p>
                                        <div>
                                            <button onClick={(e) => {e.preventDefault();
                                                this.props.onEdit(step.id);
                                            }}>edit</button>
                                        </div>
                                    </div>
                                )}
                             </div>
                        </div>
                        <div className="submit-Block"><h4>Submit the Updates:</h4> <button className="submit">submit</button></div>
                    </form>
                </div>
            )
        })
        return (
            <React.Fragment>
                <Transition
                    items={form}
                    from={{ transform: 'translate3d(0,-60px,0)', opacity: 0 }}
                    enter={{ transform: 'translate3d(0,0px,0)', opacity: 1 }}
                    leave={{ transform: 'translate3d(0,60px,0)', opacity: 0 }}>
                    {form =>
                        form && (props => <div style={props}>{form}</div>)
                    }
                </Transition>
            </React.Fragment>
        )
    }
}
export default withCorrectAccount(Edit);