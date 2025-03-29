// DOM Elements
const darkModeToggle = document.getElementById('darkModeToggle');

// Dark mode toggle
darkModeToggle.addEventListener('click', () => {
    toggleDarkMode();
});

// Toggle dark mode function
function toggleDarkMode() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    if (isDark) {
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    // Save to localStorage
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
    
    // Dispatch a custom event that other components can listen for
    const event = new CustomEvent('themeChange', { detail: { theme: isDark ? 'light' : 'dark' } });
    document.dispatchEvent(event);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Load theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Set active menu item based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
    
    document.querySelectorAll('.menu-item').forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPage) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
});