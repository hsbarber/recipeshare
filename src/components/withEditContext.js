import React from 'react';
import AuthInfoContext from './AuthInfoContext';

export function withEditContext(Component) {
    return function WrapperComponent(props) {
        return (
            <AuthInfoContext.Consumer>
                {({ getRecipe }) => <Component {...props} getRecipe={getRecipe}/>}
            </AuthInfoContext.Consumer>
        );
    };
}