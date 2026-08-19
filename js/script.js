// ======================================
// DOM Elements
// ======================================
    
const taskInput = document.getElementById("taskInput");
const addTask = document.getElementById("addTask");
const taskCount = document.getElementById("taskCount");
const completedCount = document.getElementById("completedCount");
const pendingCount = document.getElementById("pendingCount");
const taskList = document.getElementById("taskList");

const filterButtons = document.querySelectorAll(".filter-btn");
const searchInput = document.getElementById("searchInput");

const themeToggle = document.getElementById("themeToggle");

const editModal = document.getElementById("editModal");
const editTaskInput = document.getElementById("editTaskInput");
const closeModal = document.getElementById("closeModal");
const cancelEdit = document.getElementById("cancelEdit");
const saveEdit = document.getElementById("saveEdit");

const deleteModal = document.getElementById("deleteModal");
const closeDeleteModalBtn = document.getElementById("closeDeleteModal");
const cancelDelete = document.getElementById("cancelDelete");
const confirmDelete = document.getElementById("confirmDelete");

// ======================================
// Load Saved Tasks
// ======================================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

let searchKeyword = "";

let darkMode = localStorage.getItem("darkMode") === "true";

let editingTaskId = null;

let deletingTaskId = null;

// ======================================
// Initialize App
// ======================================

applyTheme();

displayTasks();

addTask.addEventListener("click", createTask);

taskInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        createTask();
    }

});




// ======================================
// Task Filters
// ======================================

filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        filterButtons.forEach(function (btn) {

            btn.classList.remove("active");

        });

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        displayTasks();

    });

});



// ======================================
// Task Search
// ======================================

searchInput.addEventListener("input", function () {

    searchKeyword = searchInput.value.trim().toLowerCase();

    displayTasks();

});



// ======================================
// Theme
// ======================================

function applyTheme() {

    document.body.classList.toggle("dark-mode", darkMode);

    const icon = themeToggle.querySelector("i");

    if (darkMode) {

        icon.classList.remove("fa-moon");

        icon.classList.add("fa-sun");

        themeToggle.setAttribute(
            "aria-label",
            "Switch to light mode"
        );

        themeToggle.setAttribute(
            "title",
            "Switch to light mode"
        );

    } else {

        icon.classList.remove("fa-sun");

        icon.classList.add("fa-moon");

        themeToggle.setAttribute(
            "aria-label",
            "Switch to dark mode"
        );

        themeToggle.setAttribute(
            "title",
            "Switch to dark mode"
        );

    }

}



// ======================================
// Theme Toggle Event
// ======================================


themeToggle.addEventListener("click", function () {

    darkMode = !darkMode;

    localStorage.setItem("darkMode", darkMode);

    applyTheme();

});





// ======================================
// Open Edit Modal
// ======================================

function openEditModal(taskId) {

    editingTaskId = taskId;

    const task = tasks.find(function (item) {

        return item.id === taskId;

    });

    if (!task) {
        return;
    }

    editTaskInput.value = task.text;

    editModal.classList.add("show");

    editModal.setAttribute("aria-hidden", "false");

    editTaskInput.focus();

}


// ======================================
// Close Edit Modal
// ======================================

function closeEditModal() {

    editModal.classList.remove("show");

    editModal.setAttribute("aria-hidden", "true");

    editingTaskId = null;

}



// ======================================
// Edit Modal Events
// ======================================

closeModal.addEventListener("click", closeEditModal);

cancelEdit.addEventListener("click", closeEditModal);




// ======================================
// Open Delete Modal
// ======================================

function openDeleteModal(taskId) {

    deletingTaskId = taskId;

    deleteModal.classList.add("show");

    deleteModal.setAttribute("aria-hidden", "false");

}


// ======================================
// Close Delete Modal
// ======================================

function closeDeleteModal() {

    deleteModal.classList.remove("show");

    deleteModal.setAttribute("aria-hidden", "true");

    deletingTaskId = null;

}



// ======================================
// Delete Modal Events
// ======================================

closeDeleteModalBtn.addEventListener(
    "click",
    closeDeleteModal
);

cancelDelete.addEventListener(
    "click",
    closeDeleteModal
);






// ======================================
// Confirm Delete
// ======================================

confirmDelete.addEventListener("click", function () {

    if (deletingTaskId === null) {
        return;
    }

    tasks = tasks.filter(function (task) {

        return task.id !== deletingTaskId;

    });

    updateApp();

    closeDeleteModal();

});



// ======================================
// Update Application
// ======================================

function updateApp() {

    saveTasks();

    displayTasks();

}

// ======================================
// Generate Task ID
// ======================================

function generateTaskId() {

    return Date.now().toString() + Math.random().toString(36).slice(2);

}

// ======================================
// Format Date
// ======================================

function getFormattedDate() {

    return new Date().toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
    });

}

// ======================================
// Create Task
// ======================================

function createTask() {

    const taskText = taskInput.value.trim();

    // Prevent empty tasks
    if (taskText === "") {

        alert("Please enter a task.");

        taskInput.focus();

        return;
    }

// ======================================
// Prevent Duplicate Tasks
// ======================================

const duplicateTask = tasks.some(function (task) {

    return task.text.toLowerCase() === taskText.toLowerCase();

});

if (duplicateTask) {

    alert("You already have this task.");

    taskInput.focus();

    return;

}

    const newTask = {

        id: generateTaskId(),

        text: taskText,

        completed: false,

        createdAt: getFormattedDate()

    };

    tasks.push(newTask);

    updateApp();

    // Clear input
    taskInput.value = "";

    // Return focus to input
    taskInput.focus();

}

// ======================================
// Save Tasks
// ======================================

function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}



// ======================================
// Save Edited Task
// ======================================

saveEdit.addEventListener("click", function () {

    if (editingTaskId === null) {
        return;
    }

    const newText = editTaskInput.value.trim();

    if (newText === "") {

        alert("Task cannot be empty.");

        editTaskInput.focus();

        return;

    }

    const task = tasks.find(function (item) {

        return item.id === editingTaskId;

    });

    if (!task) {
        return;
    }

    task.text = newText;

    updateApp();

    closeEditModal();

});



editTaskInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        saveEdit.click();

    }

});



document.addEventListener("keydown", function (event) {

    if (event.key !== "Escape") {
        return;
    }

    if (deleteModal.classList.contains("show")) {

        closeDeleteModal();

        return;

    }

    if (editModal.classList.contains("show")) {

        closeEditModal();

    }

});




// ======================================
// Display Tasks
// ======================================

function displayTasks() {

    taskList.innerHTML = "";


let filteredTasks = tasks;

// ==================================
// Apply Status Filter
// ==================================

if (currentFilter === "active") {

    filteredTasks = filteredTasks.filter(function (task) {

        return !task.completed;

    });

}

if (currentFilter === "completed") {

    filteredTasks = filteredTasks.filter(function (task) {

        return task.completed;

    });

}

// ==================================
// Apply Search Filter
// ==================================

if (searchKeyword !== "") {

    filteredTasks = filteredTasks.filter(function (task) {

        return task.text
            .toLowerCase()
            .includes(searchKeyword);

    });

}

    // ==================================
    // Empty State
    // ==================================

    if (tasks.length === 0) {

        const emptyState = document.createElement("li");

        emptyState.classList.add("empty-state");

        emptyState.innerHTML = `
            <i
                class="fa-solid fa-clipboard-list"
                aria-hidden="true">
            </i>

            <h3>No Tasks Yet</h3>

            <p>Add your first task above.</p>
        `;

        taskList.appendChild(emptyState);

        taskCount.textContent = "0 Tasks";
        completedCount.textContent = "0 Completed";
        pendingCount.textContent = "0 Pending";

        return;
    }

    // ==================================
    // Update Task Counter
    // ==================================

const completedTasks = tasks.filter(function (task) {
    return task.completed;
}).length;

const pendingTasks = tasks.length - completedTasks;

taskCount.textContent =
    `${tasks.length} Task${tasks.length !== 1 ? "s" : ""}`;

completedCount.textContent =
    `${completedTasks} Completed`;

pendingCount.textContent =
    `${pendingTasks} Pending`;

// ==================================
// Check Filter Results
// ==================================

if (filteredTasks.length === 0) {

    const emptyState = document.createElement("li");

    emptyState.classList.add("empty-state");

let message = "No tasks found.";

if (searchKeyword !== "") {

    message = `No tasks match "${searchKeyword}".`;

} else if (currentFilter === "active") {

    message = "No active tasks.";

} else if (currentFilter === "completed") {

    message = "No completed tasks.";

}
    emptyState.innerHTML = `
        <i
            class="fa-solid fa-clipboard-list"
            aria-hidden="true">
        </i>

        <h3>${message}</h3>

        <p>Try adding or completing a task.</p>
    `;

    taskList.appendChild(emptyState);

    return;
}


    // ==================================
    // Render Tasks
    // ==================================

    filteredTasks.forEach(function (task) {

        const li = document.createElement("li");

        li.classList.add("task");

        li.dataset.id = task.id;

        // Add completed class
        if (task.completed) {

            li.classList.add("completed");

        }

        // ==================================
        // Complete Button
        // ==================================

        const completeBtn = document.createElement("button");

        completeBtn.classList.add("complete");

        completeBtn.setAttribute(
            "aria-label",
            task.completed
                ? "Mark task as incomplete"
                : "Mark task as completed"
        );

        completeBtn.title =
            task.completed
                ? "Mark as incomplete"
                : "Mark as completed";

        completeBtn.innerHTML = `
            <i
                class="fa-solid fa-circle-check"
                aria-hidden="true">
            </i>
        `;

        // ==================================
        // Task Content
        // ==================================

        const taskContent = document.createElement("div");

        taskContent.classList.add("task-content");

        const taskTitle = document.createElement("span");

        taskTitle.classList.add("task-title");

        // Safely insert user text
        taskTitle.textContent = task.text;

        const createdDate = document.createElement("small");

        createdDate.classList.add("created-date");

        createdDate.textContent =
            `Created: ${task.createdAt || "Just now"}`;

        taskContent.appendChild(taskTitle);

        taskContent.appendChild(createdDate);

        // ==================================
        // Actions Container
        // ==================================

        const actions = document.createElement("div");

        actions.classList.add("actions");

        // ==================================
        // Edit Button
        // ==================================

        const editBtn = document.createElement("button");

        editBtn.classList.add("edit");

        editBtn.setAttribute(
            "aria-label",
            "Edit task"
        );

        editBtn.title = "Edit task";

        editBtn.innerHTML = `
            <i
                class="fa-solid fa-pen"
                aria-hidden="true">
            </i>
        `;

        // ==================================
        // Delete Button
        // ==================================

        const deleteBtn = document.createElement("button");

        deleteBtn.classList.add("delete");

        deleteBtn.setAttribute(
            "aria-label",
            "Delete task"
        );

        deleteBtn.title = "Delete task";

        deleteBtn.innerHTML = `
            <i
                class="fa-solid fa-trash"
                aria-hidden="true">
            </i>
        `;

        // ==================================
        // Build Task
        // ==================================

        actions.appendChild(editBtn);

        actions.appendChild(deleteBtn);

        li.appendChild(completeBtn);

        li.appendChild(taskContent);

        li.appendChild(actions);

        taskList.appendChild(li);

        // ==================================
        // Complete Task
        // ==================================

        completeBtn.addEventListener("click", function () {

            task.completed = !task.completed;

            updateApp();

        });

        // ==================================
        // Edit Task
        // ==================================


editBtn.addEventListener("click", function () {

    openEditModal(task.id);

});


deleteBtn.addEventListener("click", function () {

    openDeleteModal(task.id);

});

    });

}







// ======================================
// Close Modal When Clicking Outside
// ======================================

editModal.addEventListener("click", function (event) {

    if (event.target === editModal) {

        closeEditModal();

    }

});


deleteModal.addEventListener("click", function (event) {

    if (event.target === deleteModal) {

        closeDeleteModal();

    }

});

















