import { AddCard } from "components/card/AddCard";
import RenderAllCards from "components/card/RenderAllCards";
import { useCreateListStore } from "hooks/listHooks/useStore";

const RenderAllLists = () => {
  const { lists } = useCreateListStore();
  return (
    <div className="flex gap-4 overflow-x-auto p-4">
      {lists.map((list) => (
        <div
          key={list.id}
          className="bg-gray-100 rounded-md shadow-sm w-64 flex-shrink-0 p-3"
        >
          {/* List Header */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold">{list.title}</h2>
            <button className="text-gray-500 hover:text-gray-700">⋯</button>
          </div>

          <RenderAllCards listId={list.id} />

          {/* Add Card Button */}
          <AddCard listId={list.id} />
        </div>
      ))}
    </div>
  );
};

export default RenderAllLists;
