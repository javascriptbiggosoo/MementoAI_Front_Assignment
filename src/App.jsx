import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useDrag } from "./hooks/useDrag";
import Column from "./components/Column";
import styled from "styled-components";
import Toast from "./components/common/Toast";

const getItems = (count, offset = 0) =>
  Array.from({ length: count }, (_, k) => k + offset).map((k) => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }));

const initialColumns = [
  { id: "column-1", items: getItems(10), warning: false },
  { id: "column-2", items: [], warning: false },
  { id: "column-3", items: [], warning: false },
  { id: "column-4", items: [], warning: false },
];

export default function App() {
  const { columns, handleDragEnd, handleDragUpdate, toast } =
    useDrag(initialColumns);

  return (
    <>
      <DragDropContext
        onDragEnd={handleDragEnd}
        onDragUpdate={handleDragUpdate}
      >
        <ColumnListStyle>
          {columns.map((column, index) => (
            <Column
              key={column.id}
              items={column.items}
              columnId={index.toString()}
              warning={column.warning}
            />
          ))}
        </ColumnListStyle>
      </DragDropContext>
      {toast.show && <Toast message={toast.message} show={toast.show} />}
    </>
  );
}

const ColumnListStyle = styled.div`
  display: flex;
  justify-content: space-around;
`;
