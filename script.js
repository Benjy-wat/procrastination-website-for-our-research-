const introScreen = document.getElementById('introScreen');
const loginForm = document.getElementById('loginForm');
const loginUsername = document.getElementById('loginUsername');
const logoutBtn = document.getElementById('logoutBtn');
const menuBtn = document.getElementById('menuBtn');
const sideMenu = document.getElementById('sideMenu');
const closeMenuBtn = document.getElementById('closeMenuBtn');
const creditBtn = document.getElementById('creditBtn');
const creditsPanel = document.getElementById('creditsPanel');
const closeCreditsBtn = document.getElementById('closeCreditsBtn');
const backToMenuBtn = document.getElementById('backToMenuBtn');
const taskForm = document.getElementById('taskForm');
const usernameDisplay = document.getElementById('usernameDisplay');
const navUsernameDisplay = document.getElementById('navUsernameDisplay');
const userInitials = document.getElementById('userInitials');
const taskInput = document.getElementById('taskInput');
const taskFeedback = document.getElementById('taskFeedback');
const timeGreeting = document.getElementById('timeGreeting');
const todayDate = document.getElementById('todayDate');
const subjectSelect = document.getElementById('subjectSelect');
const paceSelect = document.getElementById('paceSelect');
const favoriteSubjectDisplay = document.getElementById('favoriteSubjectDisplay');
const studyPaceDisplay = document.getElementById('studyPaceDisplay');
const reminderQuote = document.getElementById('reminderQuote');
const reminderAuthor = document.getElementById('reminderAuthor');
const reminderAbout = document.getElementById('reminderAbout');

const SESSION_KEY = 'thsCDCPreviewSession';
const TASK_KEY = 'thsCDCPreviewTask';
const SUBJECT_KEY = 'thsCDCPreviewSubject';
const PACE_KEY = 'thsCDCPreviewPace';
const REMINDER_KEY = 'thsCDCPreviewReminder';
const REMINDERS = [
    {
        quote: 'Well done is better than well said.',
        author: 'Benjamin Franklin',
        about: 'American writer, inventor, and statesman'
    },
    {
        quote: 'To strive, to seek, to find, and not to yield.',
        author: 'Alfred, Lord Tennyson',
        about: 'English poet and Poet Laureate'
    },
    {
        quote: 'A thing of beauty is a joy for ever.',
        author: 'John Keats',
        about: 'English Romantic poet'
    }
];
localStorage.removeItem('startBeforeLaterUsers');

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

function getPreferenceKey(key, username) {
    return `${key}:${username.trim().toLowerCase()}`;
}

function getReminderKey(username) {
    return getPreferenceKey(REMINDER_KEY, username);
}

function advanceReminder(username) {
    const reminderKey = getReminderKey(username);
    const previousIndex = Number.parseInt(localStorage.getItem(reminderKey) || '-1', 10);
    const nextIndex = (Number.isInteger(previousIndex) ? previousIndex + 1 : 0) % REMINDERS.length;
    localStorage.setItem(reminderKey, String(nextIndex));
    showReminder(nextIndex);
}

function showReminder(index) {
    const reminder = REMINDERS[index];
    if (!reminder) {
        return;
    }

    if (reminderQuote) {
        reminderQuote.textContent = `“${reminder.quote}”`;
    }

    if (reminderAuthor) {
        reminderAuthor.textContent = reminder.author;
    }

    if (reminderAbout) {
        reminderAbout.textContent = reminder.about;
    }
}

function syncPreferenceDisplays() {
    if (favoriteSubjectDisplay && subjectSelect) {
        favoriteSubjectDisplay.textContent = subjectSelect.value;
    }

    if (studyPaceDisplay && paceSelect) {
        studyPaceDisplay.textContent = paceSelect.value;
    }
}

function syncDashboard(username) {
    const firstName = username || 'Student';

    if (usernameDisplay) {
        usernameDisplay.textContent = firstName;
    }

    if (navUsernameDisplay) {
        navUsernameDisplay.textContent = firstName;
    }

    if (userInitials) {
        userInitials.textContent = firstName.trim().charAt(0).toUpperCase() || 'S';
    }

    if (timeGreeting) {
        timeGreeting.textContent = getTimeGreeting();
    }

    if (todayDate) {
        todayDate.textContent = new Intl.DateTimeFormat(undefined, {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        }).format(new Date());
    }

    const subject = localStorage.getItem(getPreferenceKey(SUBJECT_KEY, firstName));
    const pace = localStorage.getItem(getPreferenceKey(PACE_KEY, firstName));
    const task = localStorage.getItem(getPreferenceKey(TASK_KEY, firstName));

    if (subjectSelect && subject) {
        subjectSelect.value = subject;
    }

    if (paceSelect && pace) {
        paceSelect.value = pace;
    }

    if (taskInput) {
        taskInput.value = task || '';
    }

    if (taskFeedback) {
        taskFeedback.textContent = task ? 'Your focus is saved for this browser.' : '';
    }

    syncPreferenceDisplays();
}

function enterDemo(username) {
    const displayName = username.trim();
    if (!displayName) {
        return;
    }

    advanceReminder(displayName);
    localStorage.setItem(SESSION_KEY, displayName);
    syncDashboard(displayName);

    if (introScreen) {
        introScreen.classList.add('hidden');
    }
}

if (loginForm && loginUsername) {
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        enterDemo(loginUsername.value);
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        const username = localStorage.getItem(SESSION_KEY);
        if (username) {
            advanceReminder(username);
        }
        localStorage.removeItem(SESSION_KEY);

        if (introScreen) {
            introScreen.classList.remove('hidden');
        }

        if (loginUsername) {
            loginUsername.focus();
        }
    });
}

function toggleMenu(forceOpen) {
    if (!sideMenu || !menuBtn) {
        return;
    }

    const openingMenu = typeof forceOpen === 'boolean' ? forceOpen : !sideMenu.classList.contains('open');
    sideMenu.classList.toggle('open', openingMenu);
    sideMenu.setAttribute('aria-hidden', String(!openingMenu));
    menuBtn.setAttribute('aria-expanded', String(openingMenu));
}

if (menuBtn) {
    menuBtn.addEventListener('click', () => toggleMenu());
}

if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', () => toggleMenu(false));
}

function toggleCreditsPanel(forceOpen) {
    if (!creditsPanel) {
        return;
    }

    const openingPanel = typeof forceOpen === 'boolean' ? forceOpen : !creditsPanel.classList.contains('open');
    creditsPanel.classList.toggle('open', openingPanel);
    creditsPanel.setAttribute('aria-hidden', String(!openingPanel));

    if (openingPanel) {
        toggleMenu(false);
    }
}

if (creditBtn) {
    creditBtn.addEventListener('click', () => toggleCreditsPanel());
}

if (closeCreditsBtn) {
    closeCreditsBtn.addEventListener('click', () => toggleCreditsPanel(false));
}

if (backToMenuBtn) {
    backToMenuBtn.addEventListener('click', () => {
        toggleCreditsPanel(false);
        toggleMenu(true);
    });
}

document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') {
        return;
    }

    if (creditsPanel && creditsPanel.classList.contains('open')) {
        toggleCreditsPanel(false);
        return;
    }

    if (sideMenu && sideMenu.classList.contains('open')) {
        toggleMenu(false);
    }
});

if (taskForm && taskInput) {
    taskForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = localStorage.getItem(SESSION_KEY);
        const task = taskInput.value.trim();

        if (!username || !task) {
            if (taskFeedback) {
                taskFeedback.textContent = 'Add a task first, then save your focus.';
            }
            return;
        }

        localStorage.setItem(getPreferenceKey(TASK_KEY, username), task);

        if (taskFeedback) {
            taskFeedback.textContent = 'Your focus is saved for this browser.';
        }
    });
}

if (subjectSelect) {
    subjectSelect.addEventListener('change', () => {
        const username = localStorage.getItem(SESSION_KEY);
        if (username) {
            localStorage.setItem(getPreferenceKey(SUBJECT_KEY, username), subjectSelect.value);
        }
        syncPreferenceDisplays();
    });
}

if (paceSelect) {
    paceSelect.addEventListener('change', () => {
        const username = localStorage.getItem(SESSION_KEY);
        if (username) {
            localStorage.setItem(getPreferenceKey(PACE_KEY, username), paceSelect.value);
        }
        syncPreferenceDisplays();
    });
}

const savedUsername = localStorage.getItem(SESSION_KEY);
if (savedUsername) {
    if (loginUsername) {
        loginUsername.value = savedUsername;
    }
    const savedReminderIndex = Number.parseInt(localStorage.getItem(getReminderKey(savedUsername)) || '0', 10);
    showReminder(savedReminderIndex);
    syncDashboard(savedUsername);

    if (introScreen) {
        introScreen.classList.add('hidden');
    }
} else if (timeGreeting) {
    timeGreeting.textContent = getTimeGreeting();
    showReminder(0);
}
