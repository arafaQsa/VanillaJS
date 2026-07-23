import { 
    getTasksService, 
    addTaskService, 
    modifyTaskService, 
    removeTaskService, 
    cancelTaskOperation 
} from "../services/taskService.js";
import { prepareTaskElementToModify, cancelModifyingElement } from "../ui/elements.js";
import { createElementObject } from "../utils/helpers.js";
import { taskAddInput, taskAddBtn, tasksContainer, tasksSelection, taskSearchInput } from "../dom.js";
import { state } from "../state/state.js";

export function registerListeners() {
    const handleAddTask = () => {
        addTaskService(taskAddInput.value);
        taskAddInput.value = "";
    };

    taskAddBtn.addEventListener("click", handleAddTask);

    taskAddInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            handleAddTask();
        }
    });

    tasksContainer.addEventListener("click", (e) => {
        const parent = e.target.parentElement;
        if (!parent) return;
        
        const elementObject = createElementObject(parent);

        if (e.target.classList.contains("taskModifyBtn")) {
            prepareTaskElementToModify(elementObject);
        }
        else if (e.target.classList.contains("taskSaveBtn")) {
            modifyTaskService(elementObject);
        }
        else if (e.target.classList.contains("taskDeleteBtn")) {
            removeTaskService(elementObject);
        }
        else if (e.target.classList.contains("taskCancelBtn")) {
            const taskId = Number(elementObject.element.dataset.id);
            cancelTaskOperation(taskId);
            cancelModifyingElement(elementObject);
        }
    });

    tasksContainer.addEventListener("keydown", (e) => {
        const parent = e.target.parentElement;
        if (!parent) return;

        const elementObject = createElementObject(parent);
        const taskId = Number(elementObject.element?.dataset?.id);

        if (e.key === "Enter" && e.target.classList.contains("taskInput")) {
            modifyTaskService(elementObject);
        }
        else if (e.key === "Escape" && taskId) {
            cancelTaskOperation(taskId);
            cancelModifyingElement(elementObject);
        }
    });

    tasksContainer.addEventListener("change", (e) => {
        if (e.target.classList.contains("taskCheckbox")) {
            const elementObject = createElementObject(e.target.parentElement);
            elementObject.input.value = elementObject.title.textContent;
            modifyTaskService(elementObject);
        }
    });

    tasksSelection.addEventListener('change', (e) => {
        state.setFilter(e.target.value);
    });

    taskSearchInput.addEventListener("input", (e) => {
        getTasksService(e.target.value);
    });
}