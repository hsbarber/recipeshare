import React from 'react';
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom';
import AuthUserContext from './AuthUserContext';
import { auth } from '../firebase/firebase'
import * as routes from '../constants/routes';

const withCorrectAccount = (Component) => {
     class withCorrectAccount extends React.Component {
        constructor() {
            super();
            this.state = {
                pending: true,
                loggedIn: undefined
            };
        }

        componentWillMount() {
            auth.onAuthStateChanged(user => {
                this.setState({
                    pending: false,
                    loggedIn: !!user
                });
            });
        }
    // componentDidMount() {
    //     firebase.auth.onAuthStateChanged(authUser => {
    //         if (!authCondition(authUser)) {
    //           this.props.history.push(routes.SIGN_IN);
    //         }
    //       });
    // }
        // console.log(condition);

        render() {
            const findRecipe = this.props.recipes.filter(rec => {
				if(rec.user === this.props.user) {
					return rec;
			}});
            const recipeTitles = findRecipe.map(rec => rec.title.split(' ').join(''));
            if (this.state.pending) return null;
            return (
                <div>
                    {this.state.loggedIn && recipeTitles.indexOf(this.props.match.params.title) >= 0 ?
                        <Component {...this.props} />
                        :
                        <h1>Component not found!</h1>
                    }
                </div>
            )
        }
    // render() {
    //   return (
    //     <AuthUserContext.Consumer>
    //       {authUser => authUser ?

    //       <Component

    //       {...this.props}
    //         authCopyUser={this.props.authCopyUser}
    //         title={this.props.title}
    //         category={this.props.category}
    //         recipeTime={this.props.recipeTime}
    //         editRecipe={this.props.editRecipe}
    //         editable={this.props.editable}
    //         canEdit={this.props.canEdit}
    //         getRecipe={this.props.getRecipe}
    //         handleChange={this.props.handleChange}
    //         handleSelect={this.props.handleSelect}
    //         recipes={this.props.recipes}
    //         updateRecipe={this.props.updateRecipe}
    //         onEditSubmit={this.props.onEditSubmit}
    //         onArraySubmit={this.props.onArraySubmit}
    //         editID={this.props.editID}
    //         onEdit={this.props.onEdit}
    //         onCancel={this.props.onCancel}
    //         onDelete={this.props.onDelete}
    //         imageURL={this.props.imageURL}
    //         isUploading={this.props.isUploading}
    //         progress={this.props.progress}
    //         error={this.props.error}
    //         handleUploadStart = {this.props.handleUploadStart}
    //         handleProgress={this.props.handleProgress}
    //         handleUploadError={this.props.handleUploadError}
    //         handleUploadSuccess={this.props.handleUploadSuccess}
    //         user={this.props.user}






    //       /> : null}
    //     </AuthUserContext.Consumer>
    //   );
    // }
    }
    return withRouter(withCorrectAccount);
}

export default withCorrectAccount;