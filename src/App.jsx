import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useDrag } from "./hooks/useDrag";
import Column from "./components/Column";

export default function App() {
  const getItems = (count, offset = 0) =>
    Array.from({ length: count }, (v, k) => k + offset).map((k) => ({
      id: `item-${k}`,
      content: `item ${k}`,
    }));

  const initialColumns = [
    { id: "column-1", items: getItems(10) },
    { id: "column-2", items: getItems(10, 10) },
    { id: "column-3", items: getItems(10, 20) },
    { id: "column-4", items: getItems(10, 30) },
  ];

  const { columns, handleDragEnd } = useDrag(initialColumns);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        {columns.map((column, index) => (
          <Column
            key={column.id}
            items={column.items}
            columnId={index.toString()}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
