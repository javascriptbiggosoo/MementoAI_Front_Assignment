import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import ColumnItem from "./ColumnItem";
import { GRID } from "../constants/style";
import styled from "styled-components";

export default function Column({ columnId, items }) {
  return (
    <ColumnStyle>
      <div className="header">{columnId}</div>
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

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: GRID,
  width: 200,
  minHeight: 700,
});
