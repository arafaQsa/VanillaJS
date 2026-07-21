import { getTasks, postTask, putTask, deleteTask } from "../api/tasksAPI.js";
import { state } from "../state/state.js";

export async function getTasksService() {
    try {
        state.setLoading(true);
        const fetchedTasks = await getTasks();
        state.setTasks(fetchedTasks);
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

    const tempId = Date.now();
    const optimisticTask = { id: tempId, title, isCompleted: false };

    state.addTask(optimisticTask);

    try {
        const createdTask = await postTask({ title, isCompleted: false });
        state.replaceTask(tempId, createdTask)
        return true;
    } catch (error) {
        state.deleteTask(tempId);
        state.setOperationError(error);
        return false;
    }
}

export async function modifyTaskService(taskElementObject) {
    const taskId = Number(taskElementObject.element.dataset.id);
    const currentTask = state.tasks.find(tsk => tsk.id === taskId);

    if (!currentTask) return false;

    const title = taskElementObject.input.value.trim();
    const isCompleted = taskElementObject.checkbox.checked;

    if (!title) {
        state.setOperationError("Modifying failed because the task title cannot be empty.");
        return false;
    }

    const previousTaskState = { ...currentTask };

    const updatedProperties = { isCompleted, title };
    const safeTask = { ...currentTask, ...updatedProperties };
    delete safeTask.id;
    delete safeTask.createdAt;
    delete safeTask.updatedAt;

    state.updateTask(taskId, updatedProperties);

    try {
        await putTask(taskId, safeTask)
        return true;
    } catch (error) {
        state.updateTask(taskId, previousTaskState);
        state.setOperationError(error);
        return false;
    }
}

export async function removeTaskService(taskElementObject) {
    const taskId = Number(taskElementObject.element.dataset.id);
    const taskToDelete = state.tasks.find(tsk => tsk.id === taskId);

    if (!taskToDelete) return false;

    const originalIndex = state.tasks.findIndex(tsk => tsk.id === taskId);

    state.deleteTask(taskId);

    try {
        await deleteTask(taskId)
        return true;
    } catch (error) {
        state.restoreTask(taskToDelete, originalIndex)
        state.setOperationError(error);
        return false;
    }
}