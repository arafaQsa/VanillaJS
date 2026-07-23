import { renderAllTasks, renderResponseStatus, toggleUiLoadingState, rendertaskCount } from "../ui/render.js";
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

        if (property === "loading") {
            console.log(`🔄 الـ Proxy رصد تغيير حالة الـ Loading إلى: [${value}]`);
            toggleUiLoadingState(value);
        }
        else if (property === "tasks" || property === "filter") {
            if (property === "tasks") {
                console.log('🔄 الـ Proxy رصد تغيير فى الـ Tasks وقام بتحديث الواجهة');
                renderAllTasks();
                if (rawData.filter !== "all") {
                    const filteredCount = filterTasks(rawData.filter);
                    rendertaskCount(filteredCount);
                }
                else {
                    rendertaskCount(value.length);
                }
                renderResponseStatus(null)
            }
            else {
                const filteredCount = filterTasks(value);
                rendertaskCount(filteredCount);
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
                    displayMessage = "Unable to reach the server.";
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
    replaceTask(tempId, newTask) {
        reactiveData.tasks = reactiveData.tasks.map(task =>
            task.id === tempId ? newTask : task
        );
    },
    restoreTask(taskToRestore, originalIndex) {
        const currentTasks = [...reactiveData.tasks];
        currentTasks.splice(originalIndex, 0, taskToRestore);
        reactiveData.tasks = currentTasks;
    }
};