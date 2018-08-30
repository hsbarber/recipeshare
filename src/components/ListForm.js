import React from 'react';

function ListForm ({addItemArray, inputName}) {
  // Input tracker
  let input1;
  return (
    <div className={inputName + "s-input"}>
      {inputName === 'ingredient' ?
        <input ref={node => {
          input1 = node;
        }}/> :
        <textarea ref={node => {
          input1 = node;
        }} />
      }
      <button onClick={(e) => {
        e.preventDefault();
        addItemArray(input1.value, inputName + 's');
        input1.value = '';

      }}>
        Add {inputName} +
      </button>
    </div>
  );
};


export default ListForm;


