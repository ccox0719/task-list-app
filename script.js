// Sort tasks by priority
const sortTasksByPriority = (tasks) => {
    return tasks.sort((a, b) => a.priority - b.priority);
};

// Get tasks for a specific date
const getTasksForDate = (date) => {
    const currentDay = daysOfWeek[date.getDay()];

    const dailyTasks = tasks.tasks.daily || [];
    const weekdayTasks = tasks.tasks.weekdays.find((group) =>
        group.days.includes(currentDay)
    )?.tasks || [];
    const weekendTasks = tasks.tasks.weekend.find((group) =>
        group.days.includes(currentDay)
    )?.tasks || [];
    const specificTasks = tasks.tasks.specific?.reduce((acc, group) => {
        if (group.days.includes(currentDay)) {
            acc.push(...group.tasks);
        }
        return acc;
    }, []) || [];

    // Combine all tasks and sort by priority
    const allTasks = [...dailyTasks, ...weekdayTasks, ...weekendTasks, ...specificTasks];
    return sortTasksByPriority(allTasks);
};

// Display tasks
const displayTasks = (tasks) => {
    taskList.innerHTML = ""; // Clear existing tasks

    tasks.forEach((taskObj, index) => {
        const { task } = taskObj; // Extract task name
        const listItem = document.createElement("li");

        // Create a checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `task-${index}`;
        checkbox.addEventListener("change", () => toggleTask(checkbox, listItem));

        // Create a label for the task
        const label = document.createElement("label");
        label.htmlFor = `task-${index}`;
        label.textContent = task;

        // Append checkbox and label to the list item
        listItem.appendChild(checkbox);
        listItem.appendChild(label);

        taskList.appendChild(listItem);
    });

    updateProgress();
};
