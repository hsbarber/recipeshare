import React from 'react';
import AuthUserContext from './AuthUserContext';
import { db } from '../firebase/firebase';
import withAuthorization from './withAuthorization';

let newArray = [];
const UserFilter = (props) =>
    <div>
        {props.users.filter(user => {
                if (user.username === "samuel") {
                    {props.newUser(user.username)}
                }
            })
        }
    </div>


// const UserInfo = (props) =>


//  	<div>
//         <AuthUserContext.Consumer>

//         {authUser =>

//             // <UsersMatch authUser={authUser} {...props}/>
//             <UserFilter users={props.users} authUser={authUser}/>

//         }
//         </AuthUserContext.Consumer>
//         {/* <button onClick={console.log(UsersMatch)}>Click</button> */}
//     </div>

// export default UserInfo;
const UserInfo = (props) =>
    <div>
        <AuthUserContext.Consumer>
        {
        authUser =>
        <div>
            <UserFilter users={props.users} authUser={authUser} newUser={props.newUser}/>
            <h4>{props.user}</h4>
        </div>
        }
        </AuthUserContext.Consumer>
    </div>

//const authCondition = (authUser) => !!authUser;

export default UserInfo;