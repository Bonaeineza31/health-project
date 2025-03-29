
const profileDropdown = document.getElementById('profileDropdown');
const profileMenu = document.getElementById('profileMenu');

profileDropdown.addEventListener('click', () => {
    profileMenu.style.display = profileMenu.style.display === 'block' ? 'none' : 'block';
});

window.addEventListener('click', (e) => {
    if (!profileDropdown.contains(e.target)) {
        profileMenu.style.display = 'none';
    }
});


document.querySelectorAll('.language-selector a').forEach(el => {
    el.addEventListener('click', (e) => {
        e.preventDefault();
        

        document.querySelectorAll('.language-selector a').forEach(btn => {
            btn.classList.remove('active');
        });
        el.classList.add('active');

        const lang = el.getAttribute('data-lang');
        localStorage.setItem('language', lang);
        
      
        const event = new CustomEvent('languageChange', { detail: { language: lang } });
        document.dispatchEvent(event);
    });
});

document.addEventListener('DOMContentLoaded', () => {

    const savedLanguage = localStorage.getItem('language') || 'en';

    document.querySelectorAll('.language-selector a').forEach(el => {
        el.classList.remove('active');
        if (el.getAttribute('data-lang') === savedLanguage) {
            el.classList.add('active');
        }
    });
});