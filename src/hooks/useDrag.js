import { useState, useCallback } from "react";

export const useDrag = (initialColumns) => {
  const [columns, setColumns] = useState(initialColumns);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.filter((_, index) => index === startIndex);
    const newList = result.filter((_, index) => index !== startIndex);
    newList.splice(endIndex, 0, removed);
    return newList;
  };

  const handleDragEnd = useCallback(
    (result) => {
      if (!result.destination) {
        return;
      }

      if (
        result.source.droppableId === "0" &&
        result.destination.droppableId === "2"
      ) {
        // TODO: UI 개선
        alert("이동할 수 없는 지점입니다.");
        return;
      }

      const sourceColumnIndex = result.source.droppableId;
      const destinationColumnIndex = result.destination.droppableId;

      if (sourceColumnIndex === destinationColumnIndex) {
        // 동일한 판 내에서 움직인 경우
        const newItems = reorder(
          columns[sourceColumnIndex].items,
          result.source.index,
          result.destination.index
        );
        const newColumns = [...columns];
        newColumns[sourceColumnIndex] = {
          ...newColumns[sourceColumnIndex],
          items: newItems,
        };
        setColumns(newColumns);
      } else {
        // 다른 판으로 움직인 경우
        const sourceItems = columns[sourceColumnIndex].items.filter(
          (_, index) => index !== result.source.index
        );
        const [removed] = columns[sourceColumnIndex].items.filter(
          (_, index) => index === result.source.index
        );
        const destinationItems = [
          ...columns[destinationColumnIndex].items.slice(
            0,
            result.destination.index
          ),
          removed,
          ...columns[destinationColumnIndex].items.slice(
            result.destination.index
          ),
        ];

        const newColumns = [...columns];
        newColumns[sourceColumnIndex] = {
          ...newColumns[sourceColumnIndex],
          items: sourceItems,
        };
        newColumns[destinationColumnIndex] = {
          ...newColumns[destinationColumnIndex],
          items: destinationItems,
        };
        setColumns(newColumns);
      }
    },
    [columns]
  );

  // TODO: 이동할 수 없는 지점으로 아이템을 드래그 할 경우, 제약이 있음을 사용자가 알 수 있도록 합니다. (ex. 드래그 중인 아이템의 색상이 붉은색으로 변경됨 등)
  const handleDragUpdate = useCallback(
    (result) => {
      console.log(result);
    },
    [columns]
  );

  return { columns, handleDragEnd, handleDragUpdate };
};
