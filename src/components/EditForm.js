import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import CategoryAPI from '../categories'
import FileUploader from 'react-firebase-file-uploader';
import AuthInfoContext from '../components/AuthInfoContext';
import firebase from '../firebase/firebase'
import withEdit from './EditProvider';


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
class EditForm extends Component {
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
    render() {
        <AuthInfoContext.Consumer>
            {({ editRecipe }) => (
                console.log(editRecipe)
            )}
        </AuthInfoContext.Consumer>
        return (
            <div>
                <h1>Edit Form</h1>
            </div>
        );
    }
}

export default EditForm;