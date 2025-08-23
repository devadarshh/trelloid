"use client";

import { useGetBoardStore } from "hooks/boardHooks/useStore";
import BoardNavBar from "./_components/BoardNavBar";
import { useEffect } from "react";

const BoardIdLayout = ({ children }: { children: React.ReactNode }) => {
  const { currentBoard } = useGetBoardStore();

  useEffect(() => {
    if (currentBoard?.title) {
      document.title = `${currentBoard.title} | Trelloid`;
    } else {
      document.title = "Trelloid";
    }
  }, [currentBoard?.title]);

  return (
    <div className="relative min-h-screen h-full overflow-y-auto overflow-x-hidden">
      <div
        className="fixed inset-0 bg-no-repeat bg-cover bg-center -z-10"
        style={{
          backgroundImage: `url(${currentBoard?.imageFullUrl || ""})`,
        }}
      />
      <div className="fixed inset-0 bg-black/10 -z-10" />

      <BoardNavBar />
      <main className="relative pt-28 w-full max-w-full overflow-x-auto overflow-y-hidden">
        {children}
      </main>
    </div>
  );
};

export default BoardIdLayout;
