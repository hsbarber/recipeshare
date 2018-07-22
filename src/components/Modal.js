import React from 'react';
import PropTypes from 'prop-types';

function Modal (props){

      return (
        <div>
          <div className="Modal">
            <p>Are you sure you want to Delete?</p>
            <p><button onClick={() => props.removeItem(props.recipes.id)}>Delete</button><button onClick={() => props.closeModal()}>Close</button></p>
          </div>
        </div>
      )
  }
Modal.PropTypes = {
  removeItem: PropTypes.func,
  recipes: PropTypes.shape ({
    id: PropTypes.string
  }),
  closeModal: PropTypes.func,
}
  export default Modal;