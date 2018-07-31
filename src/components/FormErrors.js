import React from 'react';
import PropTypes from 'prop-types';

function FormErrors (props) {
    return (
        <div className='formErrors'>
        {Object.keys(props.formErrors).map((fieldName, i) => {
            if(props.formErrors[fieldName].length > 0){
            return (

                <p key={i}>{fieldName} {props.formErrors[fieldName]}</p>

            )
            } else {
            return '';
            }
        })}
        </div>
    );
}
FormErrors.propTypes = {
    formErrors: PropTypes.objectOf(PropTypes.string)
}
export default FormErrors;