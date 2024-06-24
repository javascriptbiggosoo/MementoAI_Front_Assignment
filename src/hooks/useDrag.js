import { useState, useCallback } from "react";

export const useDrag = (initialColumns) => {
  const [columns, setColumns] = useState(initialColumns);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const handleDragEnd = useCallback(
    (result) => {
      if (!result.destination) {
        return;
      }

      const sourceColumnIndex = result.source.droppableId;
      const destinationColumnIndex = result.destination.droppableId;

      if (sourceColumnIndex === destinationColumnIndex) {
        const newItems = reorder(
          columns[sourceColumnIndex].items,
          result.source.index,
          result.destination.index
        );
        const newColumns = [...columns];
        newColumns[sourceColumnIndex].items = newItems;
        setColumns(newColumns);
      } else {
        const sourceItems = Array.from(columns[sourceColumnIndex].items);
        const destinationItems = Array.from(
          columns[destinationColumnIndex].items
        );
        const [removed] = sourceItems.splice(result.source.index, 1);
        destinationItems.splice(result.destination.index, 0, removed);

        const newColumns = [...columns];
        newColumns[sourceColumnIndex].items = sourceItems;
        newColumns[destinationColumnIndex].items = destinationItems;
        setColumns(newColumns);
      }
    },
    [columns]
  );

  return { columns, handleDragEnd };
};
