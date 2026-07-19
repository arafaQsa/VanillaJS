import { getTasks, postTask, putTask, deleteTask } from "../api/tasksAPI.js";
import { state } from "../state/state.js";

export async function getTasksService() {
    try {
        state.setLoading(true);
        const tasks = await getTasks();
        state.setTasks(tasks ?? []);
    } catch (error) {
        state.setOperationError(error);
    }
}

export async function addTaskService(taskTitle) {
    state.setLoading(true);

    const title = taskTitle.trim();
    if (!title) {
        state.setOperationError("Enter a task title");
        return false;
    }
    
    try {
        const newTask = { title, isCompleted: false };
        const savedTask = await postTask(newTask);

        state.addTask(savedTask);
        return true;
    } catch (error) {
        state.setOperationError(error);
        return false;
    }
}

export async function modifyTaskService(taskElementObject) {
    state.setLoading(true);

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
        await putTask(taskId, safeTask);
        state.updateTask(taskId, updatedProperties);
        return true;
    } catch (error) {
        state.setOperationError(error);
        return false;
    }
}

export async function removeTaskService(taskElementObject) {
    state.setLoading(true);
    const taskId = Number(taskElementObject.element.dataset.id);

    try {
        await deleteTask(taskId);
        state.deleteTask(taskId);
        return true;
    } catch (error) {
        state.setOperationError(error);
        return false;
    }
}