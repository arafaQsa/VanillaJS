import { getTasks, postTask, putTask, deleteTask } from "../api/tasksAPI.js";
import { state } from "../state/state.js";

export async function getTasksService() {
    try {
        state.setLoading(true);
        await getTasks()
        .then((fetchedTasks) => {
            state.setTasks(fetchedTasks);
        });
    } catch (error) {
        state.setOperationError(error);
    } finally {
        state.setLoading(false);
    }
}

export async function addTaskService(taskTitle) {
    const title = taskTitle.trim();
    if (!title) {
        state.setOperationError("Enter a task title");
        return false;
    }

    try {
        state.setLoading(true);

        const newTask = { title, isCompleted: false };
        await postTask(newTask)
        .then((createdTask) => {
            state.addTask(createdTask);
        });
        return true;
    } catch (error) {
        state.setOperationError(error);
        return false;
    } finally {
        state.setLoading(false);
    }
}

export async function modifyTaskService(taskElementObject) {
    const taskId = Number(taskElementObject.element.dataset.id);
    const currentTask = state.tasks.find(tsk => tsk.id === taskId);
    const title = taskElementObject.input.value.trim();
    const isCompleted = taskElementObject.checkbox.checked;

    if (!title) {
        state.setOperationError("Modifying failed because the task title cannot be empty.");
        return false;
    }

    const updatedProperties = { isCompleted, title };
    const safeTask = { ...currentTask, ...updatedProperties };
    delete safeTask.id;
    delete safeTask.createdAt;
    delete safeTask.updatedAt;

    try {
        state.setLoading(true);
        await putTask(taskId, safeTask)
        .then(() => {
            state.updateTask(taskId, updatedProperties);
        })
        return true;
    } catch (error) {
        state.setOperationError(error);
        return false;
    } finally {
        state.setLoading(false);
    }
}

export async function removeTaskService(taskElementObject) {
    const taskId = Number(taskElementObject.element.dataset.id);

    try {
        state.setLoading(true);
        await deleteTask(taskId)
        .then(() => {
            state.deleteTask(taskId);
        });
        return true;
    } catch (error) {
        state.setOperationError(error);
        return false;
    } finally {
        state.setLoading(false);
    }
}