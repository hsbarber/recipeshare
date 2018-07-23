import React from 'react';
import Remove from '../icons/Remove.js';

const ListItem = ({item, remove, index, name}) => {
  return (<li><span className="index">{index +1}</span><h4>{item.text} </h4><span  className="remove" onClick={() => {remove(item.id, name)}}><Remove /></span></li>);
}
const PrintCurrentList = ({list, remove, name}) => {

  // Map through the list
  const listNode = list.map((item, index) => {
    return (<ListItem item={item} key={item.id} remove={remove} index={index} name={name}/> )
  });
  return (<ul className={name}>{listNode}</ul>);

}

export default PrintCurrentList;