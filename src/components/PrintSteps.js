import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// const ListItem = ({item, remove, index, name}) => {
//   return (<li onClick={() => {remove(item.id, name)}}>{index +1} - {item.text}</li>);
// }
const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: 250,
});
function PrintSteps(props){

  // Map through the list
//   const listNode = list.map((item, index) => {
//     return (<ListItem item={item} key={item.id} remove={remove} index={index} name="steps"/> )
//   });
  return (
    <DragDropContext  onDragEnd={props.onDragEndSteps}>
    <Droppable droppableId="droppable">
      {(provided, snapshot) => (
        <ul
          ref={provided.innerRef}
          style={getListStyle(snapshot.isDraggingOver)}
          className={"ingredients"}
        >
          {props.steps.map((item, index) => (
            <Draggable key={item.id} draggableId={item.id} index={index}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={getItemStyle(
                    snapshot.isDragging,
                    provided.draggableProps.style
                  )}
                >
                  {item.content}
                </div>
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
export default PrintSteps;