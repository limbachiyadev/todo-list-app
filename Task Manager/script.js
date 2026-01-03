// Task Manager Script
// Demonstrating: Lists (Arrays), Functions, File Handling (JSON)

document.addEventListener('DOMContentLoaded', () => {
    // Skills: Variables and DOM Manipulation
    const taskInput = document.getElementById('task-input');
    const addBtn = document.getElementById('add-btn');
    const saveBtn = document.getElementById('save-btn');
    const loadBtnTrigger = document.getElementById('load-btn-trigger');
    const fileInput = document.getElementById('file-input');
    const taskListElement = document.getElementById('task-list');
    const emptyState = document.getElementById('empty-state');

    // Skill: Lists (Array to store task objects)
    let tasks = [];

    // Initialize
    renderTasks();

    // Event Listeners
    addBtn.addEventListener('click', () => {
        addTask(taskInput.value);
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask(taskInput.value);
        }
    });

    // Skill: File Handling (Saving/Exporting)
    saveBtn.addEventListener('click', saveTasksToFile);

    // Skill: File Handling (Loading/Importing)
    loadBtnTrigger.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            loadTasksFromFile(file);
        }
    });

    // Skill: Functions
    function addTask(text) {
        if (text.trim() === '') return;

        const newTask = {
            id: Date.now(),
            text: text,
            completed: false
        };

        tasks.push(newTask);
        taskInput.value = '';
        renderTasks();
    }

    function removeTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        renderTasks();
    }

    function toggleTask(id) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            renderTasks();
        }
    }

    function renderTasks() {
        taskListElement.innerHTML = '';

        if (tasks.length === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';

            tasks.forEach(task => {
                const li = document.createElement('li');
                li.className = `task-item ${task.completed ? 'completed' : ''}`;

                li.innerHTML = `
                    <div class="task-content" onclick="toggleTask(${task.id})">
                        <div class="checkbox-visual"></div>
                        <span class="task-text">${escapeHtml(task.text)}</span>
                    </div>
                    <button class="delete-btn" onclick="removeTask(${task.id})" aria-label="Delete task">
                        <i class='bx bx-trash'></i>
                    </button>
                `;

                taskListElement.appendChild(li);
            });
        }
    }

    // Helper to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // --- File Handling Logic ---

    function saveTasksToFile() {
        // serialize tasks array to JSON string
        const jsonContent = JSON.stringify(tasks, null, 2);

        // Create a Blob (File-like object)
        const blob = new Blob([jsonContent], { type: 'application/json' });

        // Create a download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'my_tasks.json';

        // Trigger download
        document.body.appendChild(a);
        a.click();

        // Cleanup
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function loadTasksFromFile(file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            try {
                const content = e.target.result;
                const parsedTasks = JSON.parse(content);

                if (Array.isArray(parsedTasks)) {
                    tasks = parsedTasks;
                    renderTasks();
                    alert('Tasks loaded successfully!');
                } else {
                    alert('Invalid file format: JSON must be an array of tasks.');
                }
            } catch (error) {
                alert('Error parsing JSON file: ' + error.message);
            }
        };

        reader.readAsText(file);
        // Reset input to allow selecting the same file again
        fileInput.value = '';
    }

    // Expose functions globally for inline HTML event handlers
    window.removeTask = removeTask;
    window.toggleTask = toggleTask;
});
