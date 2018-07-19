import React from 'react';


function IngredientForm ({addItemArray, inputValue, name, value, handleChange}) {

  return (
    <div>
      <input type="text" name={inputValue}
      placeholder={`What are the ${name} in your recipe?`}
      onChange={(e) => handleChange(e)}
      value={value}/>
      <button onClick={(e) => {
        e.preventDefault();
        addItemArray(value, name)
      }}>Add {name}</button>
    </div>
  )
};

export default IngredientForm;