import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { PasswordForgetLink } from './PasswordForget';
import { SignUpLink } from './SignUp';
import { auth } from '../firebase';
import * as routes from '../constants/routes';

const SignInPage = ({ history, users, changeUser }) =>
  <div className="container-bg">
    <div className="form--container">
      <div className="form">
        <h2>Sign In</h2>
        <SignIn history={history} users={users}
        changeUser={changeUser}
        />

      </div>
    </div>
  </div>
const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const signInState = {
  email: '',
  password: '',
  error: null,
};

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = { ...signInState};
  }
  // componentDidUpdate() {
  //   const { users } = this.props;
  //     users.forEach(user => {
  //         if ( this.props.authCopyUser !== null && user.email === this.props.authCopyUser.email) {
  //           //this.setState({ user: user.username });
  //           console.log(user.username)
  //           {() => this.props.changeUser(user.username)}
  //         }
  //     })
  // }

  onSubmit = (event) => {
    event.preventDefault();
    const {
      email,
      password,
    } = this.state;
    const {
      history,
      users,
      changeUser,
    } = this.props;

    auth.doSignInWithEmailAndPassword(email, password)
    .then((authUser) => {
      this.setState({ ...signInState });
      if (authUser) {
        console.log(users);
        users.forEach(user => {
          if (user.email === authUser.email) {
              changeUser(user.username, user.email)
          }
        })
      }

    })
    .then(() => {
     history.push(routes.HOME);
    })
    .catch(error => {
      this.setState(byPropKey('error', error));
    });


  }

  render() {
    const {
      email,
      password,
      error,
    } = this.state;

    const isInvalid =
      password === '' ||
      email === '';

    return (
      <form className="form--inputs" onSubmit={this.onSubmit}>
        <h4>Welcome Back, sign in to continue to RecipeShare</h4>
        <input
          value={email}
          onChange={event => this.setState(byPropKey('email', event.target.value))}
          type="text"
          placeholder="Email Address"
        />
        <input
          value={password}
          onChange={event => this.setState(byPropKey('password', event.target.value))}
          type="password"
          placeholder="Password"
        />
        <button disabled={isInvalid} type="submit">
          Sign In
        </button>
        <PasswordForgetLink />
        <SignUpLink />
        { error && <p>{error.message}</p> }
      </form>
    );
  }
}

export default withRouter(SignInPage);

export {
  SignIn,
};