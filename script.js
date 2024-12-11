document.addEventListener("DOMContentLoaded", () => {
    const dateDisplay = document.getElementById("date-display");
    const taskList = document.getElementById("task-list");
    const progressBar = document.getElementById("progress-bar");
    const progressPercentage = document.getElementById("progress-percentage");
    const streakCounter = document.getElementById("streak-counter");

    const prevDayButton = document.getElementById("prev-day");
    const nextDayButton = document.getElementById("next-day");
    const resetTasksButton = document.getElementById("reset-tasks");

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let tasks = [];
    let streak = 0;
    let currentDate = new Date();

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

    // Fetch tasks from JSON
    const loadTasksFromJSON = async () => {
        try {
            const response = await fetch("tasks.json");
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            tasks = data;
            loadTasksForDate(currentDate);
        } catch (error) {
            console.error("Error loading tasks:", error);
        }
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
        const specificTasks = tasks.tasks.specific.reduce((acc, group) => {
            if (group.days.includes(currentDay)) {
                acc.push(...group.tasks);
            }
            return acc;
        }, []);

        return [...dailyTasks, ...weekdayTasks, ...weekendTasks, ...specificTasks];
    };

    // Load tasks for a specific date
    const loadTasksForDate = (date) => {
        dateDisplay.textContent = date.toDateString();
        const todayTasks = getTasksForDate(date);
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

    // Navigate to previous day
    const goToPreviousDay = () => {
        currentDate.setDate(currentDate.getDate() - 1);
        loadTasksForDate(currentDate);
    };

    // Navigate to next day
    const goToNextDay = () => {
        currentDate.setDate(currentDate.getDate() + 1);
        loadTasksForDate(currentDate);
    };

    // Reset tasks for the current day
    const resetTasks = () => {
        const checkboxes = document.querySelectorAll("#task-list input[type='checkbox']");
        checkboxes.forEach((checkbox) => {
            checkbox.checked = false;
            checkbox.parentElement.classList.remove("completed");
        });
        updateProgress();
    };

    // Attach event listeners to buttons
    prevDayButton.addEventListener("click", goToPreviousDay);
    nextDayButton.addEventListener("click", goToNextDay);
    resetTasksButton.addEventListener("click", resetTasks);

    // Load tasks on page load
    loadTasksFromJSON();
});
