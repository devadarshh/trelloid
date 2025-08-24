"use client";

import { useCardModal } from "hooks/cardHooks/useStore";
import { Draggable } from "@hello-pangea/dnd";
import { Card } from "types";

interface CardItemProps {
  data: Card;
  index: number;
}

const CardItem = ({ data, index }: CardItemProps) => {
  const cardModal = useCardModal();

  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          role="button"
          tabIndex={0}
          onClick={() => cardModal.onOpen(data.id)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              cardModal.onOpen(data.id);
            }
          }}
          className="truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-md shadow-sm cursor-pointer transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {data.title}
        </div>
      )}
    </Draggable>
  );
};

export default CardItem;
