import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useDrag } from "./hooks/useDrag";
import Column from "./components/Column";
import styled from "styled-components";

export default function App() {
  const getItems = (count, offset = 0) =>
    Array.from({ length: count }, (_, k) => k + offset).map((k) => ({
      id: `item-${k}`,
      content: `item ${k}`,
    }));

  const initialColumns = [
    { id: "column-1", items: getItems(10) },
    { id: "column-2", items: [] },
    { id: "column-3", items: [] },
    { id: "column-4", items: [] },
  ];

  const { columns, handleDragEnd } = useDrag(initialColumns);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <ColumnListStyle>
        {columns.map((column, index) => (
          <Column
            key={column.id}
            items={column.items}
            columnId={index.toString()}
          />
        ))}
      </ColumnListStyle>
    </DragDropContext>
  );
}

const ColumnListStyle = styled.div`
  display: flex;
  justify-content: space-around;
`;
