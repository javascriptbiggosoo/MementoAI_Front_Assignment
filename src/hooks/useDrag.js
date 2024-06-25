import { useState, useCallback } from "react";
import { useToast } from "./useToast";

export const useDrag = (initialColumns) => {
  const [columns, setColumns] = useState(initialColumns);
  const [case1, setCase1] = useState(false);
  const [case2, setCase2] = useState(false);

  const { toast, showToast } = useToast();

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
      if (case1) {
        showToast("'칼럼-0'에서 '칼럼-2'로는 이동할 수 없습니다.");
        return;
      }
      if (case2) {
        showToast("짝수 아이템은 다른 짝수 아이템 앞으로 이동할 수 없습니다.");
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
        setCase1(true);
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
        setCase1(false);
      }

      // 제약조건 2
      const sourceColumnIndex = result.source.droppableId;
      const destinationColumnIndex = result.destination.droppableId;

      const sourceItemNum =
        +columns[sourceColumnIndex].items[result.source.index].content.split(
          " "
        )[1];

      if (
        // 끝자리로 이동할 때
        result.destination.index <=
        columns[destinationColumnIndex].items.length - 1
      ) {
        let destinationItemNum =
          +columns[destinationColumnIndex].items[
            result.destination.index + 1
          ]?.content.split(" ")[1] ?? 11111111;

        if (
          // 같은 판에서 올릴때
          result.destination.droppableId === result.source.droppableId &&
          result.destination.index < result.source.index
        ) {
          destinationItemNum =
            +columns[destinationColumnIndex].items[
              result.destination.index
            ]?.content.split(" ")[1] ?? 22222222;
        }

        if (result.destination.droppableId !== result.source.droppableId) {
          destinationItemNum =
            +columns[destinationColumnIndex].items[
              result.destination.index
            ]?.content.split(" ")[1];
        }

        // console.log(result);
        // console.log(columns[destinationColumnIndex]);
        // console.log(sourceItemNum, destinationItemNum);

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
          setCase2(true);
        } else {
          setColumns(
            columns.map((column) => ({
              ...column,
              warning: false,
            }))
          );
          setCase2(false);
        }
      } else {
        setColumns(
          columns.map((column) => ({
            ...column,
            warning: false,
          }))
        );
        setCase2(false);
      }
    },
    [columns]
  );

  return { columns, handleDragEnd, handleDragUpdate, toast };
};
