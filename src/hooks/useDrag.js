import { useState, useCallback } from "react";
import { useToast } from "./useToast";

export const useDrag = (initialColumns) => {
  const [columns, setColumns] = useState(initialColumns);
  const { toast, showToast } = useToast();

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.filter((_, index) => index === startIndex);
    const newList = result.filter((_, index) => index !== startIndex);
    newList.splice(endIndex, 0, removed);
    return newList;
  };

  // TODO: 제약조건을 상태로 만들어서 중복 제거
  const handleDragEnd = useCallback(
    (result) => {
      if (!result.destination) {
        return;
      }

      if (
        result.source.droppableId === "0" &&
        result.destination.droppableId === "2"
      ) {
        showToast("'칼럼-0'에서 '칼럼-2'로는 이동할 수 없습니다.");
        return;
      }

      const sourceColumnIndex = result.source.droppableId;
      const destinationColumnIndex = result.destination.droppableId;

      const sourceItemNum =
        +columns[sourceColumnIndex].items[result.source.index].content.split(
          " "
        )[1];

      if (
        result.destination.index < columns[destinationColumnIndex].items.length
      ) {
        const destinationItemNum =
          +columns[destinationColumnIndex].items[
            result.destination.index + 1
          ]?.content.split(" ")[1] || 1;

        if (
          sourceItemNum % 2 === 0 &&
          destinationItemNum % 2 === 0 &&
          sourceItemNum !== destinationItemNum
        ) {
          showToast(
            "짝수 아이템은 다른 짝수 아이템 앞으로 이동할 수 없습니다."
          );
          return;
        }
      }

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
      if (!result.destination || !result.source) {
        setColumns(
          columns.map((column) => ({
            ...column,
            warning: false,
          }))
        );
        return;
      }

      // 제약조건 1
      if (
        result.source?.droppableId === "0" &&
        result.destination?.droppableId === "2"
      ) {
        setColumns(
          columns.map((column, index) => {
            if (index === 2) {
              return {
                ...column,
                warning: true,
              };
            }
            return column;
          })
        );
        return;
      } else {
        setColumns(
          columns.map((column) => {
            return {
              ...column,
              warning: false,
            };
          })
        );
        columns[2].warning = false;
      }
      console.log(result);

      // 제약조건 2
      const sourceColumnIndex = result.source.droppableId;
      const destinationColumnIndex = result.destination.droppableId;

      const sourceItemNum =
        +columns[sourceColumnIndex].items[result.source.index].content.split(
          " "
        )[1];

      if (
        result.destination.index < columns[destinationColumnIndex].items.length
      ) {
        const destinationItemNum =
          +columns[destinationColumnIndex].items[
            result.destination.index + 1
          ]?.content.split(" ")[1] || 1;

        if (
          sourceItemNum % 2 === 0 &&
          destinationItemNum % 2 === 0 &&
          sourceItemNum !== destinationItemNum
        ) {
          setColumns(
            columns.map((column, index) => {
              if (index === +destinationColumnIndex) {
                return {
                  ...column,
                  warning: true,
                };
              }
              return column;
            })
          );
        } else {
          setColumns(
            columns.map((column) => ({
              ...column,
              warning: false,
            }))
          );
        }
      } else {
        setColumns(
          columns.map((column) => ({
            ...column,
            warning: false,
          }))
        );
      }
    },
    [columns]
  );

  return { columns, handleDragEnd, handleDragUpdate, toast };
};
