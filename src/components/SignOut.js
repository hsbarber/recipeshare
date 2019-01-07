import React from 'react';
import PropTypes from 'prop-types';
import { auth } from '../firebase';

const SignOutButton = props => (
  <button
    type="button"
    onClick={() => {
      auth.doSignOut();
      props.changeUser(null);
    }}
  >
    Sign Out
  </button>
);

export default SignOutButton;

SignOutButton.propTypes = {
  changeUser: PropTypes.func,
};
