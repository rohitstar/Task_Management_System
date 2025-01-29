import { createSlice } from "@reduxjs/toolkit";

export const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    page: 1,
    filters: {
      status: null,
      priority: null,
      dueDate: null,
    },
    darkMode: false,
    darkModeSettings: {
      contrast: 1,
      brightness: 1,
    },
    searchQuery: "",
  },
  reducers: {
    setTasks: (state, action) => {
      if (action.payload.page === 1) {
        state.tasks = action.payload.tasks;
      } else {
        state.tasks = [...state.tasks, ...action.payload.tasks];
      }
      state.page = action.payload.page;
    },
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setDarkModeSettings: (state, action) => {
      state.darkModeSettings = { ...state.darkModeSettings, ...action.payload };
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    addTask: (state, action) => {
      state.tasks.unshift(action.payload);
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    updateTaskInStore: (state, action) => {
      const index = state.tasks.findIndex(
        (task) => task.id === action.payload.id
      );
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
  },
});
