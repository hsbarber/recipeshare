import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from './Checkbox'

function CategoryButtons (props) {
	const CategoryLinks = props.displayCategory.map((category, index) => {
		return (
			<div key={index}>
				<Checkbox name={category.text} onChange={() => props.handleFilter(index)} />
				<label>
				{category.text}
				</label>
			</div>
		)
		})

  	return (
		<div className="CategoryLinks">
		{CategoryLinks}
		</div>
    )

}
CategoryButtons.propTypes = {
	handleFilter: PropTypes.func
}
export default CategoryButtons;
//<li id={category} key={index} onClick={() => props.handleFilter(category)}><h4>{category}</h4></li>