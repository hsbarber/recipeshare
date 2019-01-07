import React from "react";
import AuthInfoContext from "./AuthInfoContext";
import { firebase } from "../firebase";

class EditProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      deleted: [],
      editRecipe: [],
      editable: "",
      editID: [],
      canEdit: false
    };
    this.updateRecipe = this.updateRecipe.bind(this);
    this.getRecipe = this.getRecipe.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onArraySubmit = this.onArraySubmit.bind(this);
    this.onEditSubmit = this.onEditSubmit.bind(this);
    this.newState = this.newState.bind(this);
  }

  render() {
    return (
      <AuthInfoContext.Provider
        value={{
          state: this.state,
          getRecipe: this.getRecipe,
          newState: this.newState
        }}
      >
        > >{this.props.children}
      </AuthInfoContext.Provider>
    );
  }
}

export default EditProvider;
