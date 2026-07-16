import { getTasks } from "../api/tasksAPI.js";

export const state = {
    tasks: [],
    filter: "all",
    loading: false,
    editingTaskId: null
}

state.tasks = await getTasks();