export function filterTasks(filterType) {
    const allTasks = document.querySelectorAll(".taskElement");

    allTasks.forEach(task => {
        const isChecked = task.querySelector(".taskCheckbox").checked;

        task.classList.remove("hidden");

        if (filterType === 'completed' && !isChecked) {
            task.classList.add("hidden");
        } else if (filterType === 'in-progress' && isChecked) {
            task.classList.add("hidden");
        }
    });
}