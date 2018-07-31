import React from 'react';

function ListForm ({addItemArray, checkButton, inputName, buttonValid}) {
  // Input tracker
  let input1;
  return (
    <div className={inputName + 'sForm'}>
      {inputName === 'ingredient' ?
        <input ref={node => {
          input1 = node;
        }} onChange={() => checkButton(input1.value, inputName)} /> :
        <textarea ref={node => {
          input1 = node;
        }} onChange={() => checkButton(input1.value, inputName)}/>
      }
      <button disabled={!buttonValid} onClick={(e) => {
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


