import React from 'react';
import AuthUserContext from './AuthUserContext';
import { PasswordForget } from './PasswordForget';
import PasswordChange from './PasswordChange';
import withAuthorization from './withAuthorization';

const Account = (props) =>
    <AuthUserContext.Consumer>
    {
    authUser =>

    <div className="container-bg">
        <div className="form--container">
            <div className="form">
                <div className="form--elements">
                    <h4>Account: {authUser.email} / {props.user}</h4>
                    <PasswordForget />
                    <PasswordChange />
                </div>
            </div>
        </div>
    </div>
    }
    </AuthUserContext.Consumer>

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(Account);