import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { auth, db } from '../firebase/firebase';
import * as routes from '../constants/routes';

const SignUp = ({ history, changeUser }) => (
  <div className="container-bg">
    <div className="form--container">
      <div className="form">
        <h2>SignUp</h2>
        <SignUpForm history={history} changeUser={changeUser} />
      </div>
    </div>
  </div>
);
SignUp.propTypes = {
  history: PropTypes.object,
  changeUser: PropTypes.func,
};
const doCreateUser = (id, username, email) =>
  db.ref(`users/${id}`).set({
    username,
    email,
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
      ...signUpState,
    };
  }

  onSubmit = event => {
    const { username, email, passwordOne } = this.state;
    const { history, changeUser } = this.props;
    auth
      .createUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        doCreateUser(authUser.uid, username, email)
          .then(() => {
            this.setState({ ...signUpState });
            changeUser(username);
          })
          .then(() => {
            history.push(routes.HOME);
          })
          .catch(error => {
            this.setState({ error });
          });
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { username, email, passwordOne, passwordTwo, error } = this.state;
    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '';
    return (
      <form className="form--inputs" onSubmit={this.onSubmit}>
        <h4>Sign up to access RecipeShare</h4>
        <input
          name="username"
          value={username}
          onChange={this.onChange}
          type="text"
          placeholder="Username"
        />
        <input
          name="email"
          value={email}
          onChange={this.onChange}
          type="text"
          placeholder="Email Address"
        />
        <input
          name="passwordOne"
          value={passwordOne}
          onChange={this.onChange}
          type="password"
          placeholder="Password"
        />
        <input
          name="passwordTwo"
          value={passwordTwo}
          onChange={this.onChange}
          type="password"
          placeholder="Confirm Password"
        />
        <button disabled={isInvalid} type="submit">
          Sign Up
        </button>
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={routes.SIGN_UP}>Sign Up</Link>
  </p>
);

export default withRouter(SignUp);

export { SignUpForm, SignUpLink };

SignUpForm.propTypes = {
  history: PropTypes.object,
  changeUser: PropTypes.func,
};
