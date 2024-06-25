import { useState } from "react";
import { useToast } from "./useToast";

export const useDrag = (initialColumns) => {
  const [columns, setColumns] = useState(initialColumns);
  const [selectedItems, setSelectedItems] = useState([]);
  const [case1, setCase1] = useState(false);
  const [case2, setCase2] = useState(false);
  const { toast, showToast } = useToast();
  // console.log(selectedItems);

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    if (selectedItems.length === 0 || selectedItems.length === 1) {
      normalDragEnd(result);
    } else {
      multiDragEnd(result);
    }

    setColumns((prev) =>
      prev.map((column) => ({
        ...column,
        warning: false,
      }))
    );
    setCase1(false);
    setCase2(false);
  };

  // selected된 모든 아이템을 destinationColumnIndex로 이동
  const multiDragEnd = (result) => {
    if (case1) {
      showToast(
        "'칼럼-0'의 아이템이 포함된 경우 '칼럼-2'로는 이동할 수 없습니다."
      );
      return;
    }
    if (case2) {
      showToast(
        "선택된 마지막 아이템이 짝수일 때 다른 짝수 아이템 앞으로 이동할 수 없습니다."
      );
      return;
    }

    // TODO: selectedItems의 아이템을 selected false로 전환후 destination으로 이동
    // TODO: 각 칼럼에서 기존 selected 아이템 제거
    const destinationColumnIndex = parseInt(result.destination.droppableId, 10);
    const newColumns = [...columns];
    const newItems = [];
    for (let i = 0; i < newColumns.length; i++) {
      newColumns[i].items = newColumns[i].items.filter(
        (item) =>
          !selectedItems.some((selected) => selected.item.id === item.id)
      );
    }

    for (let i = 0; i < selectedItems.length; i++) {
      const { item } = selectedItems[i];
      newItems.push({ ...item, selected: false });
    }

    // console.log(destinationColumnIndex, result.destination.index);
    newColumns[destinationColumnIndex].items.splice(
      result.destination.index,
      0,
      ...newItems
    );
    setColumns(newColumns);

    setSelectedItems([]);
  };

  const normalDragEnd = (result) => {
    if (case1) {
      showToast("'칼럼-0'에서 '칼럼-2'로는 이동할 수 없습니다.");
      return;
    }
    if (case2) {
      showToast("짝수 아이템은 다른 짝수 아이템 앞으로 이동할 수 없습니다.");
      return;
    }

    const sourceColumnIndex = parseInt(result.source.droppableId, 10);
    const destinationColumnIndex = parseInt(result.destination.droppableId, 10);

    // 같은 칼럼에서 이동한 경우
    if (sourceColumnIndex === destinationColumnIndex) {
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
    }
    // 다른 칼럼으로 이동한 경우
    else {
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
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.filter((_, index) => index === startIndex);
    const newList = result.filter((_, index) => index !== startIndex);
    newList.splice(endIndex, 0, removed);
    return newList;
  };

  const handleDragUpdate = (result) => {
    if (!result.destination || !result.source) {
      setColumns(
        columns.map((column) => ({
          ...column,
          warning: false,
        }))
      );
      return;
    }

    if (selectedItems.length === 0 || selectedItems.length === 1) {
      normalDragUpdate(result);
      return;
    } else {
      multiDragUpdate(result);
    }
  };

  const multiDragUpdate = (result) => {
    // 제약조건 1
    if (
      result.destination?.droppableId === "2" &&
      selectedItems[0].columnIndex === "0"
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
        columns.map((column) => ({
          ...column,
          warning: false,
        }))
      );
      setCase1(false);
    }
    // 제약조건 2
    const destinationColumnIndex = parseInt(result.destination.droppableId, 10);

    const sourceItemNum =
      +selectedItems[selectedItems.length - 1].item.content.split(" ")[1];

    if (
      result.destination.index <=
      columns[destinationColumnIndex].items.length - 1
    ) {
      let destinationItemNum =
        +columns[destinationColumnIndex].items[
          result.destination.index + 1
        ]?.content.split(" ")[1] ?? 11111111;

      if (
        result.destination.droppableId !== result.source.droppableId ||
        result.destination.index < result.source.index
      ) {
        destinationItemNum =
          +columns[destinationColumnIndex].items[
            result.destination.index
          ]?.content.split(" ")[1];
      }

      if (
        sourceItemNum % 2 === 0 &&
        destinationItemNum % 2 === 0 &&
        sourceItemNum !== destinationItemNum
      ) {
        setColumns(
          columns.map((column, index) => {
            if (index === destinationColumnIndex) {
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
  };

  const normalDragUpdate = (result) => {
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
    const sourceColumnIndex = parseInt(result.source.droppableId, 10);
    const destinationColumnIndex = parseInt(result.destination.droppableId, 10);

    const sourceItemNum =
      +columns[sourceColumnIndex].items[result.source.index].content.split(
        " "
      )[1];

    if (
      result.destination.index <=
      columns[destinationColumnIndex].items.length - 1
    ) {
      let destinationItemNum =
        +columns[destinationColumnIndex].items[
          result.destination.index + 1
        ]?.content.split(" ")[1] ?? 11111111;

      if (
        result.destination.droppableId !== result.source.droppableId ||
        result.destination.index < result.source.index
      ) {
        destinationItemNum =
          +columns[destinationColumnIndex].items[
            result.destination.index
          ]?.content.split(" ")[1];
      }

      if (
        sourceItemNum % 2 === 0 &&
        destinationItemNum % 2 === 0 &&
        sourceItemNum !== destinationItemNum
      ) {
        setColumns(
          columns.map((column, index) => {
            if (index === destinationColumnIndex) {
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
  };

  const handleItemSelect = (columnIndex, itemIndex) => {
    const newColumns = [...columns];
    const item = newColumns[columnIndex].items[itemIndex];
    item.selected = !item.selected;
    setColumns(newColumns);

    if (item.selected) {
      setSelectedItems((prevSelected) =>
        [...prevSelected, { item, columnIndex, itemIndex }].sort(
          (a, b) => a.columnIndex - b.columnIndex || a.itemIndex - b.itemIndex
        )
      );
    } else {
      setSelectedItems((prevSelected) =>
        prevSelected.filter((i) => i.item.id !== item.id)
      );
    }
  };

  return {
    columns,
    handleDragEnd,
    handleDragUpdate,
    handleItemSelect,
    toast,
  };
};
