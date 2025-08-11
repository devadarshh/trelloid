import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useLoadingStore } from "hooks/boardHooks/useStore";
import { useCreateCard, useRefreshCards } from "hooks/cardHooks/useStore";
import React, { useState } from "react";
import { useEffect } from "react";

const RenderAllCards = ({ listId }: { listId: string }) => {
  const { getToken } = useAuth();
  const { setLoading } = useLoadingStore();
  //   const { cards, setCards } = useCreateCard();
  type Card = { id: string; title: string; [key: string]: any };
  const [cards, setCards] = useState<Card[]>([]);
  const { refreshCards } = useRefreshCards();

  useEffect(() => {
    const fetchAllCards = async () => {
      if (!listId) return;
      try {
        const token = await getToken();
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/v1/cards", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { listId },
          withCredentials: true,
        });
        console.log(response.data.data);
        setCards(response.data.data);
      } catch (error: any) {
        console.error(error.message || "Error Fetching All Lists");
      } finally {
        setLoading(false);
      }
    };
    fetchAllCards();
  }, [listId, refreshCards]);
  return (
    <div className="flex flex-col gap-2">
      {cards.map((card) => (
        <div
          key={card.id}
          className="bg-white rounded-md p-2 shadow-sm text-sm"
        >
          {card.title}
        </div>
      ))}
    </div>
  );
};
export default RenderAllCards;
