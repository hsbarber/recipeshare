import React, { Component } from 'react';
import { Link, withRouter, } from 'react-router-dom';
import firebase, { auth, db } from '../firebase/firebase';
import * as routes from '../constants/routes';

const SignUp = ({history}) =>
    <div className="container-bg">
        <div className="form--container">
                <div className="form">
                    <h2>SignUp</h2>
                    <SignUpForm history={history} />
                </div>
        </div>
    </div>

const doCreateUser = (id, username, email) =>
    db.ref(`users/${id}`).set({
        username,
        email,
});

const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
  });
const signUpState = {
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    error: null,
  };
class SignUpForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...signUpState
        };
    }
    onSubmit = (event) => {
        const {
            username,
            email,
            passwordOne,
          } = this.state;
          const {
            history,
          } = this.props;
          auth.createUserWithEmailAndPassword(email, passwordOne)
            .then(authUser => {
                doCreateUser(authUser.uid, username, email)
                    .then(() => {
                        this.setState({ ...signUpState});
                        history.push(routes.HOME);
                    })
                    .catch(error => {
                        this.setState(byPropKey('error', error));
                    });
            })
            .catch(error => {
              this.setState(byPropKey('error', error));
            });

          event.preventDefault();
    }
    render() {
        const {
            username,
            email,
            passwordOne,
            passwordTwo,
            error,
          } = this.state;
        const isInvalid =
            passwordOne !== passwordTwo ||
            passwordOne === '' ||
            email === '' ||
            username === '';
        return (
            <form className="form--elements" onSubmit={this.onSubmit}>
                <input
                    value={username}
                    onChange={event => this.setState(byPropKey('username', event.target.value))}
                    type="text"
                    placeholder="Username"
                />
                <input
                    value={email}
                    onChange={event => this.setState(byPropKey('email', event.target.value))}
                    type="text"
                    placeholder="Email Address"
                />
                <input
                    value={passwordOne}
                    onChange={event => this.setState(byPropKey('passwordOne', event.target.value))}
                    type="password"
                    placeholder="Password"
                />
                <input
                    value={passwordTwo}
                    onChange={event => this.setState(byPropKey('passwordTwo', event.target.value))}
                    type="password"
                    placeholder="Confirm Password"
                />
                <button disabled={isInvalid} type="submit">
                    Sign Up
                </button>
                { error && <p>{error.message}</p> }
            </form>
        );
    }
}

const SignUpLink = () =>
  <p>
    Don't have an account?
    {' '}
    <Link to={routes.SIGN_UP}>Sign Up</Link>
  </p>

export default withRouter(SignUp);

export {
  SignUpForm,
  SignUpLink,
};