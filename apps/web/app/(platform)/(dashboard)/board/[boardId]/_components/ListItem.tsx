"use client";

import { cn } from "@/lib/utils";
import CardForm from "./CardForm";
import CardItem from "./CardItem";
import ListHeader from "./ListHeader";
import { ListWithCards, Card } from "types";
import {
  Draggable,
  Droppable,
  DraggableProvided,
  DroppableProvided,
} from "@hello-pangea/dnd";

interface ListItemProps {
  data: ListWithCards;
  index: number;
}

export const ListItem: React.FC<ListItemProps> = ({ data, index }) => {
  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided: DraggableProvided) => (
        <li
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="shrink-0 h-full w-[272px] select-none"
        >
          <div
            {...provided.dragHandleProps}
            className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2 cursor-pointer"
          >
            <ListHeader data={data} />

            <Droppable droppableId={data.id} type="card">
              {(provided: DroppableProvided) => (
                <ol
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    "mx-1 px-1 py-0.5 flex flex-col gap-y-2",
                    data.cards.length > 0 ? "mt-2" : "mt-0"
                  )}
                >
                  {data.cards.map((card: Card, index: number) => (
                    <CardItem key={card.id} index={index} data={card} />
                  ))}
                  {provided.placeholder}
                </ol>
              )}
            </Droppable>

            <CardForm listId={data.id} />
          </div>
        </li>
      )}
    </Draggable>
  );
};
