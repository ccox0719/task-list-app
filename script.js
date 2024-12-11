document.addEventListener("DOMContentLoaded", () => {
    const dateDisplay = document.getElementById("date-display");
    const taskList = document.getElementById("task-list");
    const progressBar = document.getElementById("progress-bar");
    const progressPercentage = document.getElementById("progress-percentage");
    const streakCounter = document.getElementById("streak-counter");

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let tasks = [];
    let streak = 0;

    // Fetch tasks from JSON
    const loadTasksFromJSON = async () => {
        try {
            const response = await fetch("tasks.json");
            const data = await response.json();
            tasks = data;
            loadTasksForToday();
        } catch (error) {
            console.error("Error loading tasks:", error);
        }
    };

    // Get tasks for the current day
    const getTasksForDay = (day) => {
        const dailyTasks = tasks.tasks.daily || [];
        const weekdayTasks = tasks.tasks.weekdays.find((group) =>
            group.days.includes(day)
        )?.tasks || [];
        const weekendTasks = tasks.tasks.weekend.find((group) =>
            group.days.includes(day)
        )?.tasks || [];
        const specificTasks = tasks.tasks.specific.reduce((acc, group) => {
            if (group.days.includes(day)) {
                acc.push(...group.tasks);
            }
            return acc;
        }, []);

        return [...dailyTasks, ...weekdayTasks, ...weekendTasks, ...specificTasks];
    };

    // Load tasks for the current day
    const loadTasksForToday = () => {
        const today = new Date();
        const currentDay = daysOfWeek[today.getDay()];
        dateDisplay.textContent = today.toDateString();
        const todayTasks = getTasksForDay(currentDay);
        displayTasks(todayTasks);
    };

    // Display tasks with checkboxes
    const displayTasks = (tasks) => {
        taskList.innerHTML = ""; // Clear existing tasks

        tasks.forEach((task, index) => {
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

    // Toggle task completion
    const toggleTask = (checkbox, listItem) => {
        if (checkbox.checked) {
            listItem.classList.add("completed");
        } else {
            listItem.classList.remove("completed");
        }
        updateProgress();
    };

    // Update progress bar
    const updateProgress = () => {
        const totalTasks = taskList.children.length;
        const completedTasks = document.querySelectorAll(".completed").length;
        const percentage = Math.round((completedTasks / totalTasks) * 100);
        progressBar.value = percentage;
        progressPercentage.textContent = `${percentage}% Completed`;

        // Update streak if all tasks are completed
        if (completedTasks === totalTasks && totalTasks > 0) {
            streak++;
            streakCounter.textContent = streak;
        }
    };

    // Load tasks on page load
    loadTasksFromJSON();
});
