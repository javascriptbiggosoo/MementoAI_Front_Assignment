import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { GRID } from "../constants/style";
import styled from "styled-components";

const ColumnItem = React.memo(
  ({ item, index, selected, onContentClick, columnId }) => {
    const handleContentClick = () => {
      onContentClick(columnId, index);
    };

    return (
      <Draggable draggableId={item.id} index={index}>
        {(provided, snapshot) => (
          <ColumnItemStyle
            ref={provided.innerRef}
            {...provided.draggableProps}
            style={getItemStyle(
              snapshot.isDragging,
              provided.draggableProps.style,
              selected
            )}
          >
            <div {...provided.dragHandleProps} className="drag-handle">
              ||
            </div>
            <div className="draggable-content" onClick={handleContentClick}>
              {item.content}
            </div>
          </ColumnItemStyle>
        )}
      </Draggable>
    );
  }
);

const ColumnItemStyle = styled.div`
  display: flex;
  align-items: center;
  margin: 0 0 ${GRID}px 0;
  position: relative;

  .drag-handle {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    background-color: black;
    height: 100%;
    width: 25px;
    color: grey;
  }
  .draggable-content {
    width: 100%;
    text-align: end;
    padding: ${GRID}px;
    cursor: pointer;
  }
`;

const getItemStyle = (isDragging, draggableStyle, isClicked) => ({
  userSelect: "none",
  background: isDragging || isClicked ? "lightgreen" : "grey",
  ...draggableStyle,
});

export default ColumnItem;
