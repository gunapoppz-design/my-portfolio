// ==========================================
// TASK 3: TO-DO LIST LOGIC
// ==========================================
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const filterBtns = document.querySelectorAll('.filter-btn');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

function renderTasks() {
    if (!todoList) return;
    todoList.innerHTML = '';
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true;
    });

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.style.display = 'flex';
        li.style.alignItems = 'center';
        li.style.justifyContent = 'space-between';
        li.style.padding = '0.5rem';
        li.style.borderBottom = '1px solid #ccc';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => {
            tasks = tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t);
            saveAndRender();
        });

        const textSpan = document.createElement('span');
        textSpan.textContent = task.text;
        if (task.completed) textSpan.style.textDecoration = 'line-through';

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '❌';
        deleteBtn.style.border = 'none';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.style.background = 'none';
        deleteBtn.addEventListener('click', () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveAndRender();
        });

        const leftDiv = document.createElement('div');
        leftDiv.style.display = 'flex';
        leftDiv.style.gap = '0.5rem';
        leftDiv.appendChild(checkbox);
        leftDiv.appendChild(textSpan);

        li.appendChild(leftDiv);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    });
}

function addTask() {
    const text = todoInput.value.trim();
    if (text === '') return;
    tasks.push({ id: Date.now().toString(), text, completed: false });
    saveAndRender();
    todoInput.value = '';
}

function saveAndRender() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

if(addBtn) addBtn.addEventListener('click', addTask);
if(todoInput) {
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
}
filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        currentFilter = e.target.getAttribute('data-filter');
        renderTasks();
    });
});
renderTasks();


// ==========================================
// TASK 4: ASYNCHRONOUS WEATHER DASHBOARD (API)
// ==========================================
const cityInput = document.getElementById('city-input');
const weatherBtn = document.getElementById('weather-btn');
const weatherDisplay = document.getElementById('weather-display');
const weatherCity = document.getElementById('weather-city');
const weatherTemp = document.getElementById('weather-temp');
const weatherHumidity = document.getElementById('weather-humidity');
const weatherWind = document.getElementById('weather-wind');
const weatherError = document.getElementById('weather-error');

async function getWeather(city) {
    try {
        if(weatherError) weatherError.style.display = 'none';
        if(weatherDisplay) weatherDisplay.style.display = 'none';

        if (!city) {
            showError('Please enter a city name.');
            return;
        }

        const geoUrl = https://open-meteo.com{encodeURIComponent(city)}&count=1&language=en&format=json;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();
        
        if (!geoData.results || geoData.results.length === 0) {
            showError('City not found. Please try another.');
            return;
        }

        const firstResult = geoData.results[0];
        const latitude = firstResult.latitude;
        const longitude = firstResult.longitude;
        const cityName = firstResult.name;
        const countryName = firstResult.country || '';

        const weatherUrl = https://open-meteo.com{latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();
        const currentData = weatherData.current;

        if(weatherCity) weatherCity.textContent = ${cityName}, ${countryName};
        if(weatherTemp) weatherTemp.textContent = currentData.temperature_2m;
        if(weatherHumidity) weatherHumidity.textContent = currentData.relative_humidity_2m;
        if(weatherWind) weatherWind.textContent = currentData.wind_speed_10m;
        
        if(weatherDisplay) weatherDisplay.style.display = 'block';

    } catch (error) {
        showError('Network error occurred. Please try again.');
    }
}

function showError(message) {
    if(weatherError) {
        weatherError.textContent = message;
        weatherError.style.display = 'block';
    }
}

if(weatherBtn && cityInput) {
    weatherBtn.addEventListener('click', () => {
        getWeather(cityInput.value.trim());
    });
}