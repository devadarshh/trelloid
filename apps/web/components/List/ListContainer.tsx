import ListForm from "./ListForm";
import ListItem from "./ListItem";

const ListContainer = () => {
  return (
    <div>
      {
        <ol className="flex gap-x-3 h-full">
          <ListItem />
          <ListForm />
          <div className="flex-shrink-0 w-1" />
        </ol>
      }
    </div>
  );
};

export default ListContainer;
