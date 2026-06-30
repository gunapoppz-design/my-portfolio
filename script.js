// Selecting DOM Elements
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const filterBtns = document.querySelectorAll('.filter-btn');

// Load tasks from localStorage or initialize empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// Function to render tasks dynamically inside the DOM
function renderTasks() {
    todoList.innerHTML = '';
    
    // Filtering tasks based on state
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true; // 'all'
    });

    filteredTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.style.display = 'flex';
        li.style.alignItems = 'center';
        li.style.justifyContent = 'space-between';
        li.style.padding = '0.5rem';
        li.style.marginBottom = '0.5rem';
        li.style.borderBottom = '1px solid #ccc';

        // Checkbox for completion state (Update)
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTask(task.id));

        const textSpan = document.createElement('span');
        textSpan.textContent = task.text;
        if (task.completed) {
            textSpan.style.textDecoration = 'line-through';
            textSpan.style.opacity = '0.6';
        }

        // Delete Button (Delete)
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '❌';
        deleteBtn.style.background = 'none';
        deleteBtn.style.border = 'none';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        const leftDiv = document.createElement('div');
        leftDiv.style.display = 'flex';
        leftDiv.style.alignItems = 'center';
        leftDiv.style.gap = '0.5rem';
        leftDiv.appendChild(checkbox);
        leftDiv.appendChild(textSpan);

        li.appendChild(leftDiv);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    });
}

// Create: Function to Add a Task
function addTask() {
    const text = todoInput.value.trim();
    if (text === '') return;

    const newTask = {
        id: Date.now().toString(),
        text: text,
        completed: false
    };

    tasks.push(newTask);
    saveAndRender();
    todoInput.value = '';
}

// Update: Toggle completion state
function toggleTask(id) {
    tasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
    saveAndRender();
}

// Delete: Function to remove a task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveAndRender();
}

// Local Data Persistence: Save to local storage
function saveAndRender() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

// Delegated Event Listeners
addBtn.addEventListener('click', addTask);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// Event listeners for sorting filters
filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        currentFilter = e.target.getAttribute('data-filter');
        renderTasks();
    });
});

// Initial Page Render on Load
renderTasks();