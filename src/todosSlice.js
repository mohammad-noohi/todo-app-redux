import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import swal from "sweetalert";

const BASE_URL = `https://todos-json-server-db.onrender.com`;

const initialState = {
  items: [],
  loading: false,
  error: "",
};

/* Async Actions */
export const fetchTodos = createAsyncThunk("todos/fetchTodos", async () => {
  try {
    const resp = await fetch(`${BASE_URL}/todos`);
    if (!resp.ok) throw new Error("failed to fetch todos");
    const data = await resp.json();
    return data;
  } catch (err) {
    swal({
      title: err.message,
      icon: "error",
      button: "ok",
    });

    throw err;
  }
});

// Add New Todo
export const addTodo = createAsyncThunk("todos/addTodo", async newTodo => {
  try {
    const resp = await fetch(`${BASE_URL}/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTodo),
    });

    if (!resp.ok) throw new Error("failed to add new todo");
    const data = await resp.json();
    return data;
  } catch (err) {
    swal({
      title: err.message,
      icon: "error",
      button: "ok",
    });

    throw err;
  }
});

export const deleteTodo = createAsyncThunk("todos/deleteTodo", async ID => {
  try {
    const resp = await fetch(`${BASE_URL}/todos/${ID}`, { method: "DELETE" });
    if (!resp.ok) throw new Error("failed to delete todo");
    await resp.json();
    return ID;
  } catch (err) {
    swal({
      title: err.message,
      icon: "error",
      button: "ok",
    });

    throw err;
  }
});

export const updateTodo = createAsyncThunk("todos/updateTodo", async ({ id, newData }) => {
  try {
    const resp = await fetch(`${BASE_URL}/todos/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newData),
    });

    if (!resp.ok) throw new Error("failed to update todo");

    return id;
  } catch (err) {
    swal({
      title: err.message,
      icon: "error",
      button: "ok",
    });

    throw err;
  }
});

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTodos.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      /* add Todo */
      .addCase(addTodo.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      /* delet todo */
      .addCase(deleteTodo.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(todo => todo.id !== action.payload);
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      /* updateTodo */
      .addCase(updateTodo.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.map(todo => (todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo));
      });
  },
});

export default todosSlice.reducer;
