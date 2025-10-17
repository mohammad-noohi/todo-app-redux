import { useDispatch } from "react-redux";
import { deleteTodo, updateTodo } from "../todosSlice";
import swal from "sweetalert";

export default function Todo({ todo }) {
  const dispatch = useDispatch();
  const { completed, id, title } = todo;

  function handleDeleteTodo() {
    swal({
      title: "are you sure to delete this todo ?",
      icon: "warning",
      buttons: ["cancel", "delete"],
    }).then(result => {
      if (result) dispatch(deleteTodo(id));
    });
  }

  return (
    <div className={`todo ${completed ? "completed" : ""}`}>
      <li className="todo-item ">{title}</li>
      <button onClick={() => dispatch(updateTodo({ id, newData: { completed: !todo.completed } }))} className="complete-btn">
        <i className="fas fa-check-circle"></i>
      </button>
      <button onClick={handleDeleteTodo} className="trash-btn">
        <i className="fas fa-trash"></i>
      </button>
    </div>
  );
}
