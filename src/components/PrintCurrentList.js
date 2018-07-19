import React from 'react';

const ListItem = ({item, remove, index, name}) => {
  return (<li onClick={() => {remove(item.id, name)}}>{index +1} - {item.text}</li>);
}
const PrintCurrentList = ({list, remove, name}) => {
	
  // Map through the list
  const listNode = list.map((item, index) => {
    return (<ListItem item={item} key={item.id} remove={remove} index={index} name={name}/> )
  });
  return (<ul>{listNode}</ul>);

}

export default PrintCurrentList;