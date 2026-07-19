import { renderAllTasks, renderResponseStatus } from "../ui/render.js";
import { filterTasks } from "../ui/filters.js"

const rawData = {
    tasks: [],
    filter: "all",
    loading: false,
    operationError: null
};

const handler = {
    set(target, property, value) {
        target[property] = value;
        if (property === "loading" && value) {
            renderResponseStatus("Loading...")
            rawData.loading = false
        }
        else if (property === "tasks" || property === "filter") {
            if (property === "tasks") {
                renderAllTasks();
                if (value.length === 0) {
                    renderResponseStatus(null)
                }
                else {
                    renderResponseStatus(`Filter: all | Showing ${value.length} task(s)`);
                }
            }
            else {
                const filteredCount = filterTasks(value, rawData.filter);
                renderResponseStatus(`Filter: ${rawData.filter} | Showing ${filteredCount} task(s)`);
            }
        }
        else if (property === "operationError" && value) {
            console.log(`🔄 الـ Proxy رصد خطأ منظم وقام بمعالجته تلقائياً...`);

            let displayMessage = "An error occurred.";

            if (typeof value === "string") {
                displayMessage = value;
            } 
            else if (typeof value === "object") {
                if (value.message === "Failed to fetch") {
                    displayMessage = "Unable to reach the server. Please check if the backend is running or check your internet connection.";
                }
                else if (value.errors) {
                    displayMessage = `Validation Error: ${Object.values(value.errors).flat().join(" | ")}`;
                } else {
                    displayMessage = value.detail || value.message || "Server Error";
                }
            }

            renderResponseStatus(displayMessage);
            rawData.operationError = null;
        }
        return true;
    }
};

const reactiveData = new Proxy(rawData, handler);

export const state = {
    get tasks() { return [...reactiveData.tasks]; },
    get filter() { return reactiveData.filter; },

    setTasks(tasksList) { reactiveData.tasks = [...tasksList]; },
    setFilter(newFilter) { reactiveData.filter = newFilter; },
    setLoading(value) { reactiveData.loading = value },

    setOperationError(errorObjectOrString) { reactiveData.operationError = errorObjectOrString },

    addTask(newTask) {
        reactiveData.tasks = [...reactiveData.tasks, newTask]; 
    },
    deleteTask(taskId) {
        reactiveData.tasks = reactiveData.tasks.filter(task => task.id !== taskId);
    },
    updateTask(taskId, updatedFields) {
        reactiveData.tasks = reactiveData.tasks.map(task => 
            task.id === taskId ? { ...task, ...updatedFields } : task
        );
    },
};