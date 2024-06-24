import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { GRID } from "../constants/style";

const ColumnItem = React.memo(({ item, index }) => {
  return (
    <Draggable draggableId={item.id} index={index}>
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
  );
});

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  padding: GRID * 2,
  margin: `0 0 ${GRID}px 0`,
  background: isDragging ? "lightgreen" : "grey",
  ...draggableStyle,
});

export default ColumnItem;
