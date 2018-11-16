import React from 'react';
import { Spring, Transition }  from 'react-spring'
import AuthUserContext from './AuthUserContext';
import { PasswordForget } from './PasswordForget';
import PasswordChange from './PasswordChange';
import withAuthorization from './withAuthorization';


const Account = (props) =>
    <AuthUserContext.Consumer>
    { authUser =>
    <div className="container-bg">
        <div className="form--container">
            <div className="form">
                <h2>Account: {authUser.email} / {props.user}</h2>
                <div className="form--elements">
                    <div className="form--elements-block">
                        <h4>Reset your password</h4>
                        <PasswordForget />
                    </div>
                    <div className="form--elements-block">
                        <h4>Change Password</h4>
                        <PasswordChange />
                    </div>
                </div>
            </div>
        </div>
    </div>
    }
    </AuthUserContext.Consumer>



const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(Account);