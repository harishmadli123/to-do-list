document.addEventListener("DOMContentLoaded", () => {
    const taskInputBox = document.getElementById("task-input-box");
    const modal = document.getElementById("task-modal");
    const modalClose = document.getElementById("modal-close");
    const taskForm = document.getElementById("task-form");
    const taskList = document.getElementById("task-list");
    const taskNameInput = document.getElementById("task-name");
    const taskTimeInput = document.getElementById("task-time");
    const taskCategoryInput = document.getElementById("task-category");
    const aiSuggestButton = document.createElement("button");
  
    // Add AI Suggestion button
    aiSuggestButton.innerText = "AI Suggest Tasks";
    aiSuggestButton.style.margin = "10px 0";
    modal.appendChild(aiSuggestButton);
  
    // Open modal on task input click
    taskInputBox.addEventListener("click", () => {
      modal.style.display = "block";
    });
  
    // Close modal
    modalClose.addEventListener("click", () => {
      modal.style.display = "none";
    });
  
    // Close modal when clicking outside the modal content
    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  
    // Add new task
    taskForm.addEventListener("submit", (e) => {
      e.preventDefault();
  
      // Get task details
      const taskName = taskNameInput.value;
      const taskTime = taskTimeInput.value;
      const taskCategory = taskCategoryInput.value;
  
      // Create new task item
      const newTask = document.createElement("li");
      newTask.innerHTML = `${taskName} <span>${taskTime}</span>`;
  
      // Append to the task list
      taskList.appendChild(newTask);
  
      // Set Reminder Notification
      setReminder(taskName, taskTime);
  
      // Close modal and reset form
      modal.style.display = "none";
      taskForm.reset();
    });
  
    // AI Suggest Tasks
    aiSuggestButton.addEventListener("click", async () => {
      const aiTasks = await fetchAITaskSuggestions();
      if (aiTasks) {
        aiTasks.forEach((task) => {
          const newTask = document.createElement("li");
          newTask.innerHTML = `${task.name} <span>${task.time}</span>`;
          taskList.appendChild(newTask);
        });
        alert("AI suggested tasks have been added!");
      } else {
        alert("Failed to fetch AI task suggestions. Try again later.");
      }
    });
  
    // Function to fetch AI task suggestions (mocked)
    async function fetchAITaskSuggestions() {
      try {
        // Replace with actual API call to an AI service like OpenAI
        const response = await fetch("https://api.example.com/ai-suggest-tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            timeOfDay: new Date().getHours(),
          }),
        });
  
        if (!response.ok) throw new Error("Failed to fetch AI suggestions");
        return await response.json();
      } catch (error) {
        console.error(error);
        return null;
      }
    }
  
    // Set Reminder Notification
    function setReminder(taskName, taskTime) {
      const [hours, minutes] = taskTime.split(":").map(Number);
      const now = new Date();
      const reminderTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
  
      const delay = reminderTime - now;
  
      if (delay > 0 && "Notification" in window) {
        setTimeout(() => {
          new Notification("Task Reminder", {
            body: `It's time to: ${taskName}`,
          });
        }, delay);
      }
    }
  
    // Request Notification Permission
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission !== "granted") {
          alert("Enable notifications to receive task reminders.");
        }
      });
    }
  });
  