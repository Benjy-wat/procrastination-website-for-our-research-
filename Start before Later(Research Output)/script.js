const introScreen = document.getElementById('introScreen');
const enterBtn = document.getElementById('enterBtn');
const usernameDisplay = document.getElementById('usernameDisplay');
const usernameInput = document.getElementById('usernameInput');
const timeGreeting = document.getElementById('timeGreeting');

function getTimeGreeting() {
    const hour = new Date().getHours();

    if (hour < 12) {
        return 'Good morning';
    }

    if (hour < 18) {
        return 'Good afternoon';
    }

    return 'Good evening';
}

function updateTimeGreeting() {
    if (timeGreeting) {
        timeGreeting.textContent = getTimeGreeting();
    }
}

function getUsername() {
    const typedUsername = usernameInput ? usernameInput.value.trim() : '';

    if (typedUsername) {
        localStorage.setItem('thscdcUsername', typedUsername);
        return typedUsername;
    }

    const savedUsername = localStorage.getItem('thscdcUsername');
    const username = savedUsername && savedUsername.trim() ? savedUsername.trim() : 'Student';

    if (!savedUsername || !savedUsername.trim()) {
        localStorage.setItem('thscdcUsername', username);
    }

    return username;
}

function showHomePage() {
    const username = getUsername();

    if (usernameDisplay) {
        usernameDisplay.textContent = username;
    }

    updateTimeGreeting();

    if (introScreen) {
        introScreen.classList.add('hidden');
    }
}

if (enterBtn) {
    enterBtn.addEventListener('click', showHomePage);
}

if (usernameInput) {
    const savedUsername = localStorage.getItem('thscdcUsername');
    if (savedUsername) {
        usernameInput.value = savedUsername;
    }
}

updateTimeGreeting();