// app/(boards)/board/[boardId]/page.tsx
"use client";

import { AddListButton } from "components/List/AddList";

export default function BoardIdPage() {
  return (
    <div className="flex items-start gap-4 px-6 overflow-x-auto h-full">
      {/* Add list button */}
      <AddListButton />
    </div>
  );
}
