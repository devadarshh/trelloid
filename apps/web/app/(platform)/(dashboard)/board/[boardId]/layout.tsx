"use client";
import { useGetBoardStore } from "hooks/boardHooks/useStore";
import React from "react";

const BoardIdLayout = ({ children }: { children: React.ReactNode }) => {
  const { currentBoard } = useGetBoardStore();

  return (
    <div
      className="relative min-h-screen bg-no-repeat bg-cover bg-center"
      style={{
        backgroundImage: `url(${currentBoard?.imageFullUrl || ""})`,
      }}
    >
      <div className="absolute inset-0 bg-black/10" />
      <main className="relative pt-28 h-full">{children}</main>
    </div>
  );
};

export default BoardIdLayout;
