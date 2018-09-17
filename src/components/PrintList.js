import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Remove from '../icons/Remove.js';


const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'rgb(185, 185, 185)' : 'none',
});
const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',

  // change background colour if dragging
  background: isDragging ? '#D0ACDC' : ' rgb(247, 247, 247)',

  // styles we need to apply on draggables
  ...draggableStyle,
});
const getContentStyle = (isDragging, draggableStyle) => ({
  color: isDragging ? '#FFFFFF' : '#5F5F5F ',
  ...draggableStyle,
});
function PrintList ({list, dragEnd, remove, name}) {
  return (
  <DragDropContext onDragEnd={dragEnd}>
    <Droppable droppableId="droppable">
      {(provided, snapshot) => (
        <ul
          ref={provided.innerRef}
          style={getListStyle(snapshot.isDraggingOver)}
          className={"form--list"}
        >
          {list.map((item, index) => (
            <Draggable key={item.id} draggableId={item.id} index={index}>
              {(provided, snapshot) => (
                <li
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={getItemStyle(
                    snapshot.isDragging,
                    provided.draggableProps.style
                  )}
                >
                <span className="listNumber">
                      {index + 1 + '.'}
                </span>
                <span className="listContent" >
                  {item.content}
                </span>
                  <span  className="remove" onClick={() => {remove(item.id, name)}}><Remove color="#E24C3F" /></span>
                </li>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </ul>
      )}
    </Droppable>
  </DragDropContext>
  );

}
export default PrintList;