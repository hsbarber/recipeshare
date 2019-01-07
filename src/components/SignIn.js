import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { PasswordForgetLink } from './PasswordForget';
import { SignUpLink } from './SignUp';
import { auth } from '../firebase';
import * as routes from '../constants/routes';

const SignIn = ({ history, users, changeUser }) => (
  <div className="container-bg">
    <div className="form--container">
      <div className="form">
        <h2>Sign In</h2>
        <SignInForm history={history} users={users} changeUser={changeUser} />
      </div>
    </div>
  </div>
);
SignIn.propTypes = {
  history: PropTypes.object,
  users: PropTypes.instanceOf(Array),
  changeUser: PropTypes.func,
};

// const byPropKey = (propertyName, value) => () => ({
//   [propertyName]: value,
// });

const signInState = {
  email: '',
  password: '',
  error: null,
};

class SignInForm extends Component {
  constructor(props) {
    super(props);
    this.state = { ...signInState };
  }

  onSubmit = event => {
    event.preventDefault();
    const { email, password } = this.state;
    const { users, changeUser, history } = this.props;

    auth
      .doSignInWithEmailAndPassword(email, password)
      .then(authUser => {
        this.setState({ ...signInState });
        if (authUser) {
          users.forEach(user => {
            if (user.email === authUser.email) {
              changeUser(user.username, user.email);
            }
          });
        }
      })
      .then(() => {
        history.push(routes.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === '' || email === '';

    return (
      <form className="form--inputs" onSubmit={this.onSubmit}>
        <h4>Welcome Back, sign in to continue to RecipeShare</h4>
        <input
          name="email"
          value={email}
          onChange={this.onChange}
          type="text"
          placeholder="Email Address"
        />
        <input
          name="password"
          value={password}
          onChange={this.onChange}
          type="password"
          placeholder="Password"
        />
        <button disabled={isInvalid} type="submit">
          Sign In
        </button>
        <PasswordForgetLink />
        <SignUpLink />
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

export default withRouter(SignIn);

export { SignInForm };

SignInForm.propTypes = {
  history: PropTypes.object,
  users: PropTypes.instanceOf(Array),
  changeUser: PropTypes.func,
};
