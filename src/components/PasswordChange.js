import React, { Component } from 'react';

import { auth } from '../firebase';

const passChangeState = {
  passwordOne: '',
  passwordTwo: '',
  invalid: true,
  error: null,
};

class PasswordChange extends Component {
  constructor(props) {
    super(props);

    this.state = { ...passChangeState };
    this.onChange = this.onChange.bind(this);
  }

  onChange = event => {
    const { passwordOne, passwordTwo } = this.state;
    this.setState({ [event.target.name]: event.target.value });
    if (passwordOne !== passwordTwo || passwordOne === '') {
      this.setState({ invalid: false });
    }
  };

  onSubmit = event => {
    const { passwordOne } = this.state;

    auth
      .doPasswordUpdate(passwordOne)
      .then(() => {
        this.setState({ ...passChangeState });
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  render() {
    const { passwordOne, passwordTwo, invalid, error } = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        <input
          value={passwordOne}
          onChange={event => this.onChange(event)}
          type="password"
          name="passwordOne"
          placeholder="New Password"
        />
        <input
          value={passwordTwo}
          onChange={event => this.onChange(event)}
          type="password"
          name="passwordTwo"
          placeholder="Confirm New Password"
        />
        <button disabled={invalid} type="submit">
          Reset My Password
        </button>

        {error && <p className="passwordError">{error.message}</p>}
      </form>
    );
  }
}

export default PasswordChange;
