const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Fetch tasks and load for today
const loadTasksFromJSON = async () => {
    try {
        const response = await fetch("tasks.json");
        const data = await response.json();
        const today = new Date();
        const currentDay = daysOfWeek[today.getDay()];

        // Get all relevant tasks for today
        const dailyTasks = data.tasks.daily || [];
        const weekdayTasks = data.tasks.weekdays.find((group) =>
            group.days.includes(currentDay)
        )?.tasks || [];
        const weekendTasks = data.tasks.weekend.find((group) =>
            group.days.includes(currentDay)
        )?.tasks || [];
        const specificTasks = data.tasks.specific.reduce((acc, group) => {
            if (group.days.includes(currentDay)) {
                acc.push(...group.tasks);
            }
            return acc;
        }, []);

        const allTasks = [...dailyTasks, ...weekdayTasks, ...weekendTasks, ...specificTasks];
        displayTasks(allTasks);
    } catch (error) {
        console.error("Error loading tasks:", error);
    }
};

// Display tasks
const displayTasks = (tasks) => {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = ""; // Clear existing tasks

    tasks.forEach((task) => {
        const listItem = document.createElement("li");
        listItem.textContent = task;
        listItem.addEventListener("click", () => toggleTask(listItem));
        taskList.appendChild(listItem);
    });

    updateProgress();
};

// Call the function to load tasks
loadTasksFromJSON();
