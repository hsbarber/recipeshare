import React from 'react';
import AuthUserContext from './AuthUserContext';
import { firebase } from '../firebase';

const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        authUser: JSON.parse(localStorage.getItem('authUser')),
      };
    }

    componentDidMount() {
      firebase.auth.onAuthStateChanged(
        authUser => {
          localStorage.setItem('authUser', JSON.stringify(authUser));
          this.setState({ authUser });
        },
        () => {
          localStorage.removeItem('authUser');
          this.setState({ authUser: null });
        }
      );
    }
    // local storage - when component mounts, set state from local storage
    // hydrateStateWithLocalStorage() {
    //       // for each item in state
    //       Object.keys(this.state).forEach(key => {
    //         // if the key exists in localStorage
    //         if (localStorage.hasOwnProperty.call(key)) {
    //           // get the key's value from localStorage
    //           let value = localStorage.getItem(key);

    //           // parse the localStorage string and setState
    //           try {
    //             value = JSON.parse(value);
    //             this.setState({ [key]: value });
    //           } catch (e) {
    //             // handle empty string
    //             this.setState({ [key]: value });
    //           }
    //         }
    //       });
    //     }

    saveStateToLocalStorage() {
      const { state } = this;
      // for every item in state, save to ls
      Object.keys(state).forEach(key => {
        localStorage.setItem(key, JSON.stringify(state[key]));
      });
      // for (const key in this.state) {
      //   localStorage.setItem(key, JSON.stringify(this.state[key]));
      // }
    }

    render() {
      const { authUser } = this.state;
      const { state } = this;
      // for every item in state, save to ls
      // Object.keys(state).forEach(key => {
      //   console.log(key);
      //   console.log(JSON.stringify(state[key]));
      // });
      return (
        <AuthUserContext.Provider value={authUser}>
          <Component />
        </AuthUserContext.Provider>
      );
    }
  }

  return WithAuthentication;
};

export default withAuthentication;
