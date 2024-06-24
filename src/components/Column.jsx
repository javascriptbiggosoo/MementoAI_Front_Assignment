import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import ColumnItem from "./ColumnItem";
import { GRID } from "../constants/style";

export default function Column({ columnId, items }) {
  return (
    <Droppable droppableId={columnId}>
      {(provided, snapshot) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          style={getListStyle(snapshot.isDraggingOver)}
        >
          {items.map((item, index) => (
            <ColumnItem key={item.id} index={index} item={item} />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: GRID,
  width: 250,
});
