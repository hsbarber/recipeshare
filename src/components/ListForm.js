import React from 'react';

function ListForm ({addItemArray, name}) {
  // Input tracker
  let input1;
  return (
    <div className={name + 's'}>
      <input ref={node => {
        input1 = node;
      }} placeholder={name + "s"}/>

      <button onClick={(e) => {
        e.preventDefault();
        addItemArray(input1.value, name + 's');
        input1.value = '';
      }}>
        Add {name} +
      </button>
    </div>
  );
};


export default ListForm;


