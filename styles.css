document.addEventListener("DOMContentLoaded", () => {
    const dateDisplay = document.getElementById("date-display");
    const taskList = document.getElementById("task-list");
    const progressBar = document.getElementById("progress-bar");
    const progressPercentage = document.getElementById("progress-percentage");
    const streakCounter = document.getElementById("streak-counter");

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let tasks = [];
    let streak = 0;
    let currentDate = new Date();

    // Fetch tasks from JSON
    const loadTasksFromJSON = async () => {
        try {
            const response = await fetch("tasks.json");
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            console.log("Fetched Tasks JSON:", data); // Debugging
            tasks = data;
            loadTasksForDate(currentDate);
        } catch (error) {
            console.error("Error loading tasks:", error);
        }
    };

    // Sort tasks by priority
    const sortTasksByPriority = (tasks) => {
        console.log("Tasks Before Sorting:", tasks); // Debugging
        const sortedTasks = tasks.sort((a, b) => a.priority - b.priority);
        console.log("Tasks After Sorting:", sortedTasks); // Debugging
        return sortedTasks;
    };

    // Get tasks for a specific date
    const getTasksForDate = (date) => {
        const currentDay = daysOfWeek[date.getDay()];
        console.log("Current Day:", currentDay); // Debugging

        const dailyTasks = tasks.tasks.daily || [];
        console.log("Daily Tasks:", dailyTasks); // Debugging

        const weekdayTasks = tasks.tasks.weekdays.find((group) =>
            group.days.includes(currentDay)
        )?.tasks || [];
        console.log("Weekday Tasks:", weekdayTasks); // Debugging

        const weekendTasks = tasks.tasks.weekend.find((group) =>
            group.days.includes(currentDay)
        )?.tasks || [];
        console.log("Weekend Tasks:", weekendTasks); // Debugging

        const specificTasks = tasks.tasks.specific?.reduce((acc, group) => {
            if (group.days.includes(currentDay)) {
                acc.push(...group.tasks);
            }
            return acc;
        }, []) || [];
        console.log("Specific Tasks:", specificTasks); // Debugging

        // Combine and sort tasks
        const allTasks = [...dailyTasks, ...weekdayTasks, ...weekendTasks, ...specificTasks];
        console.log("All Combined Tasks (Unsorted):", allTasks); // Debugging

        return sortTasksByPriority(allTasks);
    };

    // Display tasks
    const displayTasks = (tasks) => {
        console.log("Tasks to Display:", tasks); // Debugging
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
            notifyCompletion();
        }
    };

    // Notify task completion
    const notifyCompletion = () => {
        const email = "cac5102008@gmail.com";
        const subject = encodeURIComponent("Daily Tasks Completed");
        const body = encodeURIComponent(
            `Congratulations! All tasks for ${currentDate.toDateString()} have been completed.`
        );
        const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;

        // Automatically open email client
        window.location.href = mailtoLink;
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

    // Load tasks for a specific date
    const loadTasksForDate = (date) => {
        dateDisplay.textContent = date.toDateString();
        const todayTasks = getTasksForDate(date);
        displayTasks(todayTasks);
    };

    // Load tasks on page load
    loadTasksFromJSON();
});
