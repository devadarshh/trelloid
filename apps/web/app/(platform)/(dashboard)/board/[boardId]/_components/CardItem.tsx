import { Card } from "@prisma/client";
import { useCardModal } from "hooks/cardHooks/useStore";

interface CardItemProps {
  data: Card;
  index: number;
}

const CardItem = ({ data, index }: CardItemProps) => {
  const cardModal = useCardModal();
  return (
    <div
      role="button"
      onClick={() => {
        console.log("Opening modal with id:", data.id);
        cardModal.onOpen(data.id);
      }}
      className="truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-md shadow-sm"
    >
      {data.title}
    </div>
  );
};

export default CardItem;
