import React from "react";
import { Droppable } from "react-beautiful-dnd";
import ColumnItem from "./ColumnItem";
import { GRID } from "../constants/style";
import styled, { keyframes, css } from "styled-components";

export default function Column({ columnId, items, warning, onContentClick }) {
  return (
    <ColumnStyle>
      <div className="header">{columnId}</div>
      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <DroppableContainer
            warning={warning}
            ref={provided.innerRef}
            isDraggingOver={snapshot.isDraggingOver}
            {...provided.droppableProps}
          >
            {items.map((item, index) => (
              <ColumnItem
                key={item.id}
                index={index}
                item={item}
                selected={item.selected}
                columnId={columnId}
                onContentClick={onContentClick}
              />
            ))}
            {provided.placeholder}
          </DroppableContainer>
        )}
      </Droppable>
    </ColumnStyle>
  );
}

const ColumnStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid lightgrey;
  border-radius: 2px;
  margin: ${GRID}px;
`;

const blinkAnimation = keyframes`
  0% { background-color: lightblue; }
  25% { background-color: lightblue; }
  50% { background-color: lightblue; }
  75% { background-color: dimgray; }
  100% { background-color: dimgray; }
`;
const blinkAnimationWarning = keyframes`
  0% { background-color: lightcoral; }
  25% { background-color: lightcoral; }
  50% { background-color: lightcoral; }
  75% { background-color: dimgray; }
  100% { background-color: dimgray; }
`;

const DroppableContainer = styled.div`
  background: ${({ isDraggingOver }) =>
    isDraggingOver ? "lightblue" : "lightgrey"};
  padding: ${GRID}px;
  width: 200px;
  min-height: 700px;
  ${({ isDraggingOver }) =>
    isDraggingOver &&
    css`
      animation: ${({ warning }) =>
          warning ? blinkAnimationWarning : blinkAnimation}
        1s infinite;
    `}
`;
