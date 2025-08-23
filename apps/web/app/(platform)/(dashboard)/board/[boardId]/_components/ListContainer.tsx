"use client";

import React, { useEffect, useState } from "react";
import { ListItem } from "./ListItem";
import { ListForm } from "./ListForm";
import { ListWithCards } from "types";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";

interface ListContainerProps {
  data: ListWithCards[];
  boardId: string;
}

function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed!);
  return result;
}

const BASE_URL = "http://localhost:5000/api/v1";

const ListContainer = ({ data, boardId }: ListContainerProps) => {
  const [orderedData, setOrderedData] = useState<ListWithCards[]>(data);
  const { getToken } = useAuth();

  const executeUpdateListOrder = async (
    items: ListWithCards[],
    boardId: string
  ) => {
    try {
      const token = await getToken();
      await axios.put(
        `${BASE_URL}/lists/reorder`,
        { items, boardId },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
    } catch (error) {
      console.error("Failed to update list order:", error);
    }
  };

  const executeUpdateCardOrder = async (boardId: string, items: any) => {
    try {
      const token = await getToken();
      await axios.put(
        `${BASE_URL}/cards/reorder`,
        { items, boardId },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
    } catch (error) {
      console.error("Failed to update card order:", error);
    }
  };

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    if (type === "list") {
      const items = reorder(orderedData, source.index, destination.index).map(
        (item, index) => ({
          ...item,
          order: index,
        })
      );
      setOrderedData(items);
      executeUpdateListOrder(items, boardId);
    }

    if (type === "card") {
      const newOrderedData = [...orderedData];
      const sourceList = newOrderedData.find(
        (list) => list.id === source.droppableId
      );
      const destList = newOrderedData.find(
        (list) => list.id === destination.droppableId
      );

      if (!sourceList || !destList) return;

      if (!sourceList.cards) sourceList.cards = [];
      if (!destList.cards) destList.cards = [];

      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        );
        reorderedCards.forEach((card, idx) => (card.order = idx));
        sourceList.cards = reorderedCards;
        setOrderedData(newOrderedData);
        executeUpdateCardOrder(boardId, reorderedCards);
      } else {
        const [movedCard]: any = sourceList.cards.splice(source.index, 1);
        movedCard.listId = destination.droppableId;
        destList.cards.splice(destination.index, 0, movedCard);

        sourceList.cards.forEach((card, idx) => (card.order = idx));
        destList.cards.forEach((card, idx) => (card.order = idx));

        setOrderedData(newOrderedData);
        executeUpdateCardOrder(boardId, destList.cards);
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full cursor-pointer"
          >
            {orderedData.map((list, index) => (
              <ListItem key={list.id} index={index} data={list} />
            ))}
            {provided.placeholder}
            <ListForm boardId={boardId} />
            <div className="flex-shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ListContainer;
