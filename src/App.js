import "./App.css";
import Todo from "./Components/Todo";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTodo, fetchTodos } from "./todosSlice";

export default function App() {
  const dispatch = useDispatch();
  const [todoInput, setTodoInput] = useState("");
  const [filterType, setFilterType] = useState("all");
  const { items: todos, loading: todosLoading } = useSelector(state => state.todos);
  const visibleTodos = filterTodos();

  function filterTodos() {
    let filteredItems = [...todos];

    return filteredItems.filter(todo => {
      if (filterType === "completed") return todo.completed;
      if (filterType === "incomplete") return !todo.completed;

      return true;
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!todoInput.trim()) {
      alert("input can't be empty");
      return;
    }

    const newTodo = { title: todoInput.trim(), completed: false };

    dispatch(addTodo(newTodo));

    // clear form
    setTodoInput("");
  }

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  return (
    <>
      <header>
        <h1>Sabzlearn To Do List</h1>
      </header>
      <form onSubmit={handleSubmit}>
        <input type="text" className="todo-input" value={todoInput} onChange={e => setTodoInput(e.target.value)} />
        <button className="todo-button" type="submit">
          <i className="fas fa-plus-circle fa-lg"></i>
        </button>
        <div className="select">
          <select name="todos" className="filter-todo" value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="incomplete">Incomplete</option>
          </select>
        </div>
      </form>

      <div className="todo-container">
        {todosLoading ? (
          <p>loading...</p>
        ) : (
          <ul className="todo-list">
            {visibleTodos.map(todo => (
              <Todo key={todo.id} todo={todo} />
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
