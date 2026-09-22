const introScreen = document.getElementById('introScreen');
const enterBtn = document.getElementById('enterBtn');

function showHomePage() {
    if (introScreen) {
        introScreen.classList.add('hidden');
    }
}

if (enterBtn) {
    enterBtn.addEventListener('click', showHomePage);
}