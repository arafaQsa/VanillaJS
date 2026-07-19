export function filterTasks(filterType) {
    const allTasks = document.querySelectorAll(".taskElement");
    let all = 0;
    let inProgress = 0;
    let completed = 0;
    allTasks.forEach(task => {
        all++;
        const isChecked = task.querySelector(".taskCheckbox").checked;

        task.classList.remove("hidden");

        if (filterType === 'completed' && !isChecked) {
            inProgress++;
            task.classList.add("hidden");
        } else if (filterType === 'in-progress' && isChecked) {
            completed++;
            task.classList.add("hidden");
        }
    });

    if (filterType === 'all') {
        return all;
    }
    else if (filterType === 'completed') {
        return all - inProgress;
    }
    else if (filterType === 'in-progress') {
        return all - completed;
    }
}