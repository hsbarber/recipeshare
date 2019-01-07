import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from './Checkbox';

function CategoryButtons(props) {
  const {
    displayCategory,
    handleCheck,
    categoryChecked,
    handleAllChecked,
  } = props;
  const CategoryLinks = displayCategory.map((category, index) => (
    <div key={index}>
      <Checkbox
        key={category.id}
        id={category.id}
        value={category.text}
        checked={category.isChecked}
        onChange={event => handleCheck(event)}
      />
      <label htmlFor="category">{category.text}</label>
    </div>
  ));
  return (
    <div className="CategoryLinks">
      <button
        type="button"
        disabled={categoryChecked === false}
        onClick={handleAllChecked}
      >
        uncheck all
      </button>
      {CategoryLinks}
    </div>
  );
}

export default CategoryButtons;

CategoryButtons.propTypes = {
  handleCheck: PropTypes.func,
  categoryChecked: PropTypes.bool,
  handleAllChecked: PropTypes.func,
  displayCategory: PropTypes.instanceOf(Array),
};
