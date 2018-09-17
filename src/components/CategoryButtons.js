import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from './Checkbox'

function CategoryButtons (props) {
	const CategoryLinks = props.displayCategory.map((category, index) => {
		return (
			<div key={index}>

				<Checkbox value={category.text} checked={category.isChecked} onChange={(event) => props.handleCheck(event)} />
				<label>
				{category.text}
				</label>
			</div>
		)
		})
  	return (
		<div className="CategoryLinks">
			<button  disabled={props.categoryChecked === false} onClick={props.handleAllChecked}>uncheck all</button>
			{CategoryLinks}
		</div>
    )

}
CategoryButtons.propTypes = {
	handleFilter: PropTypes.func
}
export default CategoryButtons;
//<li id={category} key={index} onClick={() => props.handleFilter(category)}><h4>{category}</h4></li>