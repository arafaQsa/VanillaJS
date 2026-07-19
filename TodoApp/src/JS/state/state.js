import { renderAllTasks, renderResponseStatus } from "../ui/render.js";
import { filterTasks } from "../ui/filters.js"
import { getTasks } from "../api/tasksAPI.js";

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
        else if (property === "tasks") {
            console.log(`🔄 الـ Proxy رصد تغييراً في [${property}]. جاري تحديث الـ DOM تلقائياً...`);
            renderAllTasks();
        }
        else if (property === "filter") {
            console.log(`🔄 الـ Proxy رصد تغييراً في [${property}]. جاري تحديث الـ DOM تلقائياً...`);
            filterTasks(value);
        }
        else if (property === "operationError" && value) {
            console.log(`🔄 الـ Proxy رصد تغييراً في [${property}]. جاري تحديث الـ DOM تلقائياً...`);
            renderResponseStatus(`Task ${value} Failed. Please try again.`)
            rawData.operationError = null
        }
        return true;
    }
};

const reactiveData = new Proxy(rawData, handler);

export const state = {
    get tasks() {
        return [...reactiveData.tasks];
    },
    get filter() {
        return reactiveData.filter;
    },

    setTasks(tasksList) {
        reactiveData.tasks = [...tasksList];
    },
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
    setFilter(newFilter) {
        reactiveData.filter = newFilter;
    },
    setOperationError(operationType) {
        reactiveData.operationError = operationType
    },
    setLoading(value) {
        reactiveData.loading = value
    }
};