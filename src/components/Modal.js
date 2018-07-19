import React from 'react';

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

  export default Modal;