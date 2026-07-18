export function createElementObject(taskElement) {
    const taskElementObject = {
        element: taskElement,
        checkbox: taskElement.querySelector(".taskCheckbox"),
        title: taskElement.querySelector(".taskTitle"),
        input: taskElement.querySelector(".taskInput"),
        modifyBtn: taskElement.querySelector(".taskModifyBtn"),
        saveBtn: taskElement.querySelector(".taskSaveBtn"),
        deleteBtn: taskElement.querySelector(".taskDeleteBtn")
    }
    return taskElementObject
}

export function checkResponseStatus(response, errorMessage) {
    if (!response || (Array.isArray(response) && response.length === 0)) {
        operationsState.textContent = errorMessage || "No response from the server. Please check your network connection.";
        return false;
    }
    return true;
}