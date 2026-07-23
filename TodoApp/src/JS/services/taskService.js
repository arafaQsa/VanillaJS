import { getTasks, postTask, putTask, deleteTask } from "../api/tasksAPI.js";
import { state } from "../state/state.js";

const activeTaskControllers = new Map();

let searchTimeoutId = null;
let searchController = null;

export function cancelTaskOperation(taskId) {
    if (activeTaskControllers.has(taskId)) {
        console.log(`⏹️ An ongoing operation for task [${taskId}] was cancelled to avoid the Race Condition.`);
        activeTaskControllers.get(taskId).abort();
        activeTaskControllers.delete(taskId);
    }
}

// 1. Fetch and filter tasks with Debounce + AbortController
export async function getTasksService(searchTerm = "") {
    if (searchTimeoutId) {
        clearTimeout(searchTimeoutId);
    }

    searchTimeoutId = setTimeout(async () => {
        if (searchController) {
            searchController.abort();
        }
        searchController = new AbortController();

        try {
            state.setLoading(true);
            const fetchedTasks = await getTasks(searchTerm, searchController.signal);
            state.setTasks(fetchedTasks);
        } catch (error) {
            if (error.name === "AbortError") {
                console.log(`⏹️ An old search result for task [${searchTerm}] was cancelled to avoid the Race Condition.`);
                return;
            }
            state.setOperationError(error);
        } finally {
            if (searchController && !searchController.signal.aborted) {
                state.setLoading(false);
            }
        }
    }, 300);
}

let addTaskController = null;

export async function addTaskService(taskTitle) {
    const title = taskTitle.trim();
    if (!title) {
        state.setOperationError("Enter a task title");
        return false;
    }

    if (addTaskController) {
        addTaskController.abort();
    }
    addTaskController = new AbortController();

    const tempId = Date.now();
    const optimisticTask = { id: tempId, title, isCompleted: false };

    state.addTask(optimisticTask); // instance optimistic add

    try {
        const createdTask = await postTask({ title, isCompleted: false }, addTaskController.signal);
        state.replaceTask(tempId, createdTask);
        return true;
    } catch (error) {
        state.deleteTask(tempId);

        if (error.name === "AbortError") {
            console.log(`⏹️ An old add request to task [${tempId}] was cancelled to avoid the Race Condition.`);
            return false;
        }

        state.setOperationError(error);
        return false;
    } finally {
        addTaskController = null;
    }
}

export async function modifyTaskService(taskElementObject) {
    const taskId = Number(taskElementObject.element.dataset.id);

    const currentTask = state.tasks.find(tsk => tsk.id === taskId);
    if (!currentTask) return false;

    const title = taskElementObject.input ? taskElementObject.input.value.trim() : currentTask.title;
    const isCompleted = taskElementObject.checkbox ? taskElementObject.checkbox.checked : currentTask.isCompleted;

    if (!title) {
        state.setOperationError("Task title cannot be empty.");
        return false;
    }

    if (activeTaskControllers.has(taskId)) {
        activeTaskControllers.get(taskId).abort();
    }

    const controller = new AbortController();
    activeTaskControllers.set(taskId, controller);

    const previousTaskState = { ...currentTask };
    const updatedProperties = { isCompleted, title };
    const safeTask = { ...currentTask, ...updatedProperties };
    delete safeTask.id;
    delete safeTask.createdAt;
    delete safeTask.updatedAt;

    state.updateTask(taskId, updatedProperties); // instance optimistic update

    try {
        await putTask(taskId, safeTask, controller.signal);
        return true;
    } catch (error) {
        state.updateTask(taskId, previousTaskState); // Rollback

        if (error.name === "AbortError") {
            console.log(`⏹️ An old modify request to task [${taskId}] was cancelled to avoid the Race Condition.`);
            return false;
        }

        state.setOperationError(error);
        return false;
    } finally {
        if (activeTaskControllers.get(taskId) === controller) {
            activeTaskControllers.delete(taskId);
        }
    }
}

export async function removeTaskService(taskElementObject) {
    const taskId = Number(taskElementObject.element.dataset.id);

    const taskToDelete = state.tasks.find(tsk => tsk.id === taskId);
    if (!taskToDelete) return false;

    if (activeTaskControllers.has(taskId)) {
        activeTaskControllers.get(taskId).abort();
    }

    const controller = new AbortController();
    activeTaskControllers.set(taskId, controller);

    const originalIndex = state.tasks.findIndex(tsk => tsk.id === taskId);

    state.deleteTask(taskId); // instance optimistic delete

    try {
        await deleteTask(taskId, controller.signal);
        return true;
    } catch (error) {
        state.restoreTask(taskToDelete, originalIndex); // Rollback

        if (error.name === "AbortError") {
            console.log(`⏹️ An old delete request to task [${taskId}] was cancelled to avoid the Race Condition.`);
            return false;
        }

        state.setOperationError(error);
        return false;
    } finally {
        if (activeTaskControllers.get(taskId) === controller) {
            activeTaskControllers.delete(taskId);
        }
    }
}