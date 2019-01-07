import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { auth } from '../firebase';
import * as routes from '../constants/routes';

const PasswordForgetPage = () => (
  <div className="container-bg">
    <div className="form--container">
      <div className="form">
        <h2>Password Forget</h2>

        <div className="form--pwforget">
          <h4>
            Enter your email address to have an email sent to reset your
            password.
          </h4>
          <PasswordForget />
        </div>
      </div>
    </div>
  </div>
);
const passForgetState = {
  email: '',
  sent: false,
  error: null,
};
class PasswordForget extends Component {
  constructor(props) {
    super(props);

    this.state = { ...passForgetState };
  }

  onSubmit = event => {
    const { email } = this.state;

    auth
      .doPasswordReset(email)
      .then(() => {
        this.setState({ ...passForgetState, sent: true });
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  render() {
    const { email, sent, error } = this.state;

    const isInvalid = email === '';

    return (
      <form onSubmit={this.onSubmit}>
        <input
          value={email}
          onChange={event => this.setState({ email: event.target.value })}
          type="text"
          placeholder="Email Address"
        />
        <button disabled={isInvalid} type="submit">
          Send Email to Reset Password
        </button>
        <p>{sent && 'Password reset request has been sent'}</p>
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const PasswordForgetLink = () => (
  <p>
    <Link to={routes.PASSWORD_FORGET}>Forgot Password?</Link>
  </p>
);

export default PasswordForgetPage;

export { PasswordForget, PasswordForgetLink };
