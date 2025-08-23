import BoardOptions from "./BoardOptions";
import BoardTitleForm from "./BoardTitleForm";

const BoardNavBar = () => {
  return (
    <div className="w-full h-14 z-[40] bg-black/50 fixed top-14 flex items-center px-6  gap-x-4 text-white">
      <BoardTitleForm />
      <div className="ml-auto">
        <BoardOptions />
      </div>
    </div>
  );
};

export default BoardNavBar;
