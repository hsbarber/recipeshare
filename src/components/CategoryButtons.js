import React from 'react';
import CategoryAPI from '../categories'

function CategoryButtons (props) {
	const CategoryLinks = CategoryAPI.all().map((category, index) => {
		return <li id={category} key={index} onClick={props.handleFilter.bind(this, category)}><h4>{category}</h4></li>
		})

  	return (
  		<div>
	  		<section className="CategoryLinks">
	  		{CategoryLinks}
	  		</section>
      </div>
    )

}

export default CategoryButtons;