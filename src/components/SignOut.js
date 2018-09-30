import React from 'react';

import { auth } from '../firebase';

const SignOutButton = (props) =>

  <button
    type="button"
    onClick=
    {() => { auth.doSignOut(); props.changeUser(null);}}
  >
    Sign Out
  </button>

export default SignOutButton;