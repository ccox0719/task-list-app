document.addEventListener("DOMContentLoaded", () => {
    const dateDisplay = document.getElementById("date-display");
    const taskList = document.getElementById("task-list");
    const progressBar = document.getElementById("progress-bar");
    const streakCounter = document.getElementById("streak-counter");

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let tasks = [];
    let streak = 0;
    let currentAwards = [];
    let currentDate = new Date();

    // Load tasks from JSON
    const loadTasksFromJSON = async () => {
        try {
            const response = await fetch("tasks.json");
            if (!response.ok) throw new Error("Failed to load tasks.json");
            const data = await response.json();
            tasks = data;
            loadTasksForDate(currentDate);
        } catch (error) {
            console.error("Error loading tasks:", error);
        }
    };

    // Load progress from JSON
   const loadProgress = async () => {
    try {
        const response = await fetch("progress.json");
        if (!response.ok) throw new Error("Failed to load progress.json");

        const data = await response.json();
        console.log("Progress Data Loaded:", data);

        // Display streak
        const streakCounter = document.getElementById("streak-counter");
        if (streakCounter) {
            streakCounter.textContent = data.streak || 0;
        } else {
            console.error("Element with ID 'streak-counter' not found in the DOM");
        }

        // Display completed days
        const completedDaysList = document.getElementById("completed-days");
        if (completedDaysList) {
            completedDaysList.innerHTML = "";
            (data.completedDays || []).forEach(day => {
                const listItem = document.createElement("li");
                listItem.textContent = day;
                completedDaysList.appendChild(listItem);
            });
        } else {
            console.error("Element with ID 'completed-days' not found in the DOM");
        }

        // Display awards
        const awardsList = document.getElementById("awards-received");
        console.log("Awards List Element:", awardsList);
        if (awardsList) {
            awardsList.innerHTML = ""; // Clear the list
            (data.awards || []).forEach(award => {
                console.log("Rendering Award:", award); // Log each award
                const listItem = document.createElement("li");
                listItem.textContent = `${award.icon} ${award.name}`; // Display icon and name
                awardsList.appendChild(listItem);
            });
        } else {
            console.error("Element with ID 'awards-received' not found in the DOM");
        }

        console.log("Awards successfully loaded.");
    } catch (error) {
        console.error("Error loading progress.json:", error);
    }
};



    // Save progress to JSON
    const saveProgress = async (completedDays) => {
    try {
        const data = {
            streak,
            completedDays,
            awards: currentAwards,
        };

        // Log for debugging
        console.log("Saving progress:", data);

        // Save progress (for local testing, this simulates writing)
        localStorage.setItem("progress", JSON.stringify(data));

        // If using a backend server:
        // await fetch("http://your-backend-url/update-progress", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify(data),
        // });

        console.log("Progress saved successfully!");
    } catch (error) {
        console.error("Error saving progress:", error);
    }
};



    // Update progress bar and check awards
    const updateProgress = () => {
        const totalTasks = taskList.children.length;
        const completedTasks = document.querySelectorAll(".completed").length;

        // Update progress bar
        const progressPercentage = (completedTasks / totalTasks) * 100;
        progressBar.value = progressPercentage;

        if (completedTasks === totalTasks && totalTasks > 0) {
            streak++;
            streakCounter.textContent = streak;

            const today = currentDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD
            saveProgress([today]);

            showCompletionNotification(streak, today);
            checkForAwards(streak);
        }
    };

    // Check for awards
    const checkForAwards = (streak) => {
        const awards = [];

        if (streak > 50 && !currentAwards.includes("50-Day Streak Award")) {
            awards.push({ name: "50-Day Streak Award", icon: "🏆" });
            showAwardNotification("Incredible! You've achieved a 50-day streak! 🏆");
        }
        if (streak > 30 && !currentAwards.includes("30-Day Streak Award")) {
            awards.push({ name: "30-Day Streak Award", icon: "🎉" });
            showAwardNotification("Amazing! You've completed more than 30 days in a row! 🎉");
        }
        if (streak > 7 && !currentAwards.includes("7-Day Streak Award")) {
            awards.push({ name: "7-Day Streak Award", icon: "🏅" });
            showAwardNotification("Great job! You've completed more than 7 days in a row! 🏅");
        }

        if (awards.length > 0) {
            currentAwards = [...currentAwards, ...awards];
            saveProgress([]);
        }
    };

    // Show award notification
    const showAwardNotification = (message) => {
        const modal = document.createElement("div");
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            padding: 20px;
            text-align: center;
            z-index: 1000;
        `;

        modal.innerHTML = `
            <h2>🎉 Congratulations! 🎉</h2>
            <p>${message}</p>
            <button id="close-award-modal" style="padding: 10px 20px; background-color: #38efd7; border: none; border-radius: 5px; cursor: pointer; color: white;">
                Close
            </button>
        `;

        document.body.appendChild(modal);

        document.getElementById("close-award-modal").addEventListener("click", () => {
            document.body.removeChild(modal);
        });
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

    // Show completion notification
    const showCompletionNotification = (streak, completedDay) => {
        const modal = document.createElement("div");
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            padding: 20px;
            text-align: center;
            z-index: 1000;
        `;

        modal.innerHTML = `
            <h2>Congratulations!</h2>
            <p>All tasks for ${completedDay} have been completed.</p>
            <p>Your current streak: <strong>${streak} days</strong></p>
            <button id="close-modal" style="padding: 10px 20px; background-color: #38efd7; border: none; border-radius: 5px; cursor: pointer; color: white;">
                Close
            </button>
        `;

        document.body.appendChild(modal);

        document.getElementById("close-modal").addEventListener("click", () => {
            document.body.removeChild(modal);
        });
    };

    // Load tasks for the current date
    const loadTasksForDate = (date) => {
        dateDisplay.textContent = date.toDateString();
        const todayTasks = tasks.tasks.daily || [];
        taskList.innerHTML = ""; // Clear the task list

        todayTasks.forEach((taskObj, index) => {
            const listItem = document.createElement("li");
            const taskName = taskObj.task || "Unnamed Task";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.addEventListener("change", () => toggleTask(checkbox, listItem));

            listItem.textContent = taskName;
            listItem.prepend(checkbox);
            taskList.appendChild(listItem);
        });
    };

    // Initialize
    loadProgress();
    loadTasksFromJSON();
});
