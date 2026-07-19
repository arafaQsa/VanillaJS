import { getTasks, postTask, putTask, deleteTask } from "../api/tasksAPI.js";
import { state } from "../state/state.js";

export async function getTasksService() {
    state.setLoading(true)
    state.setTasks(await getTasks())
}

export async function addTaskService(taskTitle) {
    state.setLoading(true)

    const title = taskTitle.trim();
    if (!title) {
        alert("Enter a task title");
        return null;
    }
    
    const newTask = { title, isCompleted: false };
    const success = await postTask(newTask);
    
    if (success) {
        state.addTask(newTask);
        return true
    }
    state.setOperationError("Adding")
    return false
}

export async function modifyTaskService(taskElementObject) {
    state.setLoading(true)

    const taskId = Number(taskElementObject.element.dataset.id);
    const currentTask = state.tasks.find(tsk => tsk.id === taskId);

    let title = taskElementObject.input.value.trim();
    const isCompleted = taskElementObject.checkbox.checked;
    if (!title) {
        title = "No Title"
    }

    const property = {
        isCompleted,
        title
    }

    const updatedTask = { ...currentTask, ...property };
    const { id, createdDate, updatedDate, ...safeTask } = updatedTask;

    const success = await putTask(taskId, safeTask);
    if (success) {
        state.updateTask(taskId, { ...property });
        return true;
    }
    state.setOperationError("updating")
    return false;
}

export async function removeTaskService(taskElementObject) {
    state.setLoading(true)

    const taskId = Number(taskElementObject.element.dataset.id);

    const success = await deleteTask(taskId);
    if (success) {
        state.deleteTask(taskId);
        return true;
    }
    state.setOperationError("Deleting")
    return false;
}