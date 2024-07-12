document.addEventListener("DOMContentLoaded", function() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function () {
            body.classList.toggle("darkMode");
            console.log("Dark mode toggled");
        });
    } else {
        console.error('Element with ID "dark-mode-toggle" not found.');
    }
});
