import { deleteAllCards, deleteList } from "@/features/boardSlice";
import { List } from "@/types";
import { useDispatch } from "react-redux";
type Props = {
  list: List;
};
export const ListActions = ({ list }: Props) => {
  const dispatch = useDispatch();

  return (
    <div className="list-actions">
      <span>list actions</span>
      <ul>
        <li onClick={() => dispatch(deleteList(list.id))}>delete list</li>

        {list.cards?.length > 0 && (
          <li onClick={() => dispatch(deleteAllCards({ listId: list.id }))}>
            delete all cards
          </li>
        )}
      </ul>
    </div>
  );
};
