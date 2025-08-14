import React from "react";
import { ListItem } from "./ListItem";
import { ListForm } from "./ListForm";
import { useCreateListStore } from "hooks/listHooks/useStore";
import { ListWithCards } from "types";

interface ListContainerProps {
  data: ListWithCards[];
}
const ListContainer = ({ data }: ListContainerProps) => {
  return (
    <>
      <ol className="flex gap-x-3 h-full">
        {data.map((list, index) => (
          <ListItem key={list.id} index={index} data={list} />
        ))}
      </ol>
      <ListForm />
      <div className="flex-shrink-0 w-1" />
    </>
  );
};

export default ListContainer;
