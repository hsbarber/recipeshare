import React from 'react';
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom';
import AuthUserContext from './AuthUserContext';
import AuthInfoContext from './AuthInfoContext';
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
    }
    return withRouter(withCorrectAccount);
}

export default withCorrectAccount;