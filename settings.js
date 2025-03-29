// Load components
document.addEventListener('DOMContentLoaded', async function() {
    // Load navbar
    const navbarResponse = await fetch('navbar.html');
    const navbarHtml = await navbarResponse.text();
    document.getElementById('navbar-container').innerHTML = navbarHtml;
    
    // Load sidebar
    const sidebarResponse = await fetch('sidebar.html');
    const sidebarHtml = await sidebarResponse.text();
    document.getElementById('sidebar-container').innerHTML = sidebarHtml;
    
    // Initialize settings
    initSettings();
});

function initSettings() {
    // DOM Elements
    const profileDropdown = document.getElementById('profileDropdown');
    const profileMenu = document.getElementById('profileMenu');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const themeToggle = document.getElementById('themeToggle');
    const saveButton = document.getElementById('saveButton');
    const cancelButton = document.getElementById('cancelButton');
    const langEn = document.getElementById('langEn');
    const langFr = document.getElementById('langFr');
    const langKin = document.getElementById('langKin');

    // State variables
    let currentLanguage = 'en';

    // Translations
    const translations = {
        'en': {
            'settings': 'Settings',
            'personalInfo': 'Personal Information',
            'firstName': 'First Name',
            'lastName': 'Last Name',
            'email': 'Email',
            'phone': 'Phone Number',
            'dob': 'Date of Birth',
            'gender': 'Gender',
            'male': 'Male',
            'female': 'Female',
            'other': 'Other',
            'preferNotToSay': 'Prefer not to say',
            'idNumber': 'ID Number',
            'address': 'Address',
            'streetAddress': 'Street Address',
            'city': 'City',
            'country': 'Country',
            'emergencyContact': 'Emergency Contact',
            'name': 'Name',
            'relationship': 'Relationship',
            'appearance': 'Appearance',
            'theme': 'Theme',
            'light': 'Light',
            'dark': 'Dark',
            'language': 'Language',
            'notifications': 'Notification Preferences',
            'emailNotifications': 'Email Notifications',
            'smsNotifications': 'SMS Notifications',
            'appNotifications': 'App Notifications',
            'appointmentReminders': 'Appointment Reminders',
            'medicationReminders': 'Medication Reminders',
            'resultUpdates': 'Test Result Updates',
            'privacy': 'Privacy Settings',
            'shareData': 'Share data with healthcare providers',
            'researchUse': 'Allow anonymous data use for research',
            'publicProfile': 'Show my profile to other users',
            'accessibility': 'Accessibility',
            'fontSize': 'Font Size',
            'small': 'Small',
            'medium': 'Medium',
            'large': 'Large',
            'highContrast': 'High Contrast Mode',
            'screenReader': 'Screen Reader Compatibility',
            'cancel': 'Cancel',
            'save': 'Save Changes'
        },
        'fr': {
            'settings': 'Paramètres',
            'personalInfo': 'Informations Personnelles',
            'firstName': 'Prénom',
            'lastName': 'Nom de Famille',
            'email': 'E-mail',
            'phone': 'Numéro de Téléphone',
            'dob': 'Date de Naissance',
            'gender': 'Genre',
            'male': 'Homme',
            'female': 'Femme',
            'other': 'Autre',
            'preferNotToSay': 'Je préfère ne pas dire',
            'idNumber': 'Numéro d\'Identification',
            'address': 'Adresse',
            'streetAddress': 'Adresse',
            'city': 'Ville',
            'country': 'Pays',
            'emergencyContact': 'Contact d\'Urgence',
            'name': 'Nom',
            'relationship': 'Relation',
            'appearance': 'Apparence',
            'theme': 'Thème',
            'light': 'Clair',
            'dark': 'Sombre',
            'language': 'Langue',
            'notifications': 'Préférences de Notification',
            'emailNotifications': 'Notifications par E-mail',
            'smsNotifications': 'Notifications par SMS',
            'appNotifications': 'Notifications de l\'Application',
            'appointmentReminders': 'Rappels de Rendez-vous',
            'medicationReminders': 'Rappels de Médicaments',
            'resultUpdates': 'Mises à Jour des Résultats',
            'privacy': 'Paramètres de Confidentialité',
            'shareData': 'Partager les données avec les professionnels de santé',
            'researchUse': 'Autoriser l\'utilisation anonyme des données pour la recherche',
            'publicProfile': 'Montrer mon profil aux autres utilisateurs',
            'accessibility': 'Accessibilité',
            'fontSize': 'Taille de Police',
            'small': 'Petit',
            'medium': 'Moyen',
            'large': 'Grand',
            'highContrast': 'Mode Contraste Élevé',
            'screenReader': 'Compatibilité avec les Lecteurs d\'Écran',
            'cancel': 'Annuler',
            'save': 'Enregistrer les Modifications'
        },
        'kin': {
            'settings': 'Igenamiterere',
            'personalInfo': 'Amakuru Bwite',
            'firstName': 'Izina',
            'lastName': 'Irindi Zina',
            'email': 'Imeri',
            'phone': 'Telefoni',
            'dob': 'Itariki y\'Amavuko',
            'gender': 'Igitsina',
            'male': 'Gabo',
            'female': 'Gore',
            'other': 'Ikindi',
            'preferNotToSay': 'Sinkunda kubivuga',
            'idNumber': 'Nomero y\'Irangamuntu',
            'address': 'Aderesi',
            'streetAddress': 'Aho Utuye',
            'city': 'Umujyi',
            'country': 'Igihugu',
            'emergencyContact': 'Uwo Guhamagara mu Bihe Bikomeye',
            'name': 'Izina',
            'relationship': 'Isano',
            'appearance': 'Ishusho',
            'theme': 'Isura',
            'light': 'Cyera',
            'dark': 'Umukara',
            'language': 'Ururimi',
            'notifications': 'Ibyo Kumenyeshwa',
            'emailNotifications': 'Kumenyeshwa kuri Imeri',
            'smsNotifications': 'Kumenyeshwa kuri SMS',
            'appNotifications': 'Kumenyeshwa ku Porogaramu',
            'appointmentReminders': 'Urwibutso rw\'Igihe cyo Gusura Muganga',
            'medicationReminders': 'Urwibutso rwo Gufata Imiti',
            'resultUpdates': 'Amakuru y\'Ibisubizo',
            'privacy': 'Amabwiriza y\'Ibanga',
            'shareData': 'Gusangira amakuru n\'abaganga',
            'researchUse': 'Kwemerera gukoresha amakuru mu bushakashatsi',
            'publicProfile': 'Kwerekana umwirondoro wanjye ku bandi',
            'accessibility': 'Uburyo bwo Kugera ku Makuru',
            'fontSize': 'Ingano y\'Imyandiko',
            'small': 'Muto',
            'medium': 'Hagati',
            'large': 'Munini',
            'highContrast': 'Ishusho Igaragara Cyane',
            'screenReader': 'Ibifasha Abasomyi b\'Ishashho',
            'cancel': 'Kureka',
            'save': 'Kubika Impinduka'
        }
    };

    // Profile dropdown toggle
    if (profileDropdown) {
        profileDropdown.addEventListener('click', () => {
            profileMenu.style.display = profileMenu.style.display === 'block' ? 'none' : 'block';
        });

        // Close dropdown when clicking outside
        window.addEventListener('click', (e) => {
            if (!profileDropdown.contains(e.target)) {
                profileMenu.style.display = 'none';
            }
        });
    }

    // Dark mode toggle in sidebar
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            toggleDarkMode();
        });
    }

    // Theme toggle in settings
    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            toggleDarkMode();
        });
    }

    // Toggle dark mode function
    function toggleDarkMode() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        if (isDark) {
            document.documentElement.setAttribute('data-theme', 'light');
            if (themeToggle) themeToggle.checked = false;
            if (darkModeToggle) {
                darkModeToggle.innerHTML = '<i class="fa fa-moon-o"></i><span>Dark Mode</span>';
            }
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (themeToggle) themeToggle.checked = true;
            if (darkModeToggle) {
                darkModeToggle.innerHTML = '<i class="fa fa-sun-o"></i><span>Light Mode</span>';
            }
        }

        // Save to localStorage
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
        
        // Dispatch theme change event for other components
        document.dispatchEvent(new CustomEvent('themeChange', {
            detail: { theme: isDark ? 'light' : 'dark' }
        }));
    }

    // Language buttons
    if (langEn) langEn.addEventListener('click', () => changeLanguage('en'));
    if (langFr) langFr.addEventListener('click', () => changeLanguage('fr'));
    if (langKin) langKin.addEventListener('click', () => changeLanguage('kin'));

    // Change language function
    function changeLanguage(lang) {
        currentLanguage = lang;

        // Update language buttons
        if (langEn) langEn.classList.remove('active');
        if (langFr) langFr.classList.remove('active');
        if (langKin) langKin.classList.remove('active');

        if (lang === 'en' && langEn) langEn.classList.add('active');
        if (lang === 'fr' && langFr) langFr.classList.add('active');
        if (lang === 'kin' && langKin) langKin.classList.add('active');

        // Update all text elements
        updateTranslations();

        // Save to localStorage
        localStorage.setItem('language', lang);
    }

    // Update translations
    function updateTranslations() {
        // Update page title
        const settingsTitle = document.getElementById('settingsTitle');
        if (settingsTitle) settingsTitle.textContent = translations[currentLanguage].settings;

        // Update personal info section
        const personalInfoTitle = document.getElementById('personalInfoTitle');
        if (personalInfoTitle) personalInfoTitle.textContent = translations[currentLanguage].personalInfo;
        
        const firstNameLabel = document.getElementById('firstNameLabel');
        if (firstNameLabel) firstNameLabel.textContent = translations[currentLanguage].firstName;
        
        const lastNameLabel = document.getElementById('lastNameLabel');
        if (lastNameLabel) lastNameLabel.textContent = translations[currentLanguage].lastName;
        
        const emailLabel = document.getElementById('emailLabel');
        if (emailLabel) emailLabel.textContent = translations[currentLanguage].email;
        
        const phoneLabel = document.getElementById('phoneLabel');
        if (phoneLabel) phoneLabel.textContent = translations[currentLanguage].phone;
        
        const dobLabel = document.getElementById('dobLabel');
        if (dobLabel) dobLabel.textContent = translations[currentLanguage].dob;
        
        const genderLabel = document.getElementById('genderLabel');
        if (genderLabel) genderLabel.textContent = translations[currentLanguage].gender;
        
        const idNumberLabel = document.getElementById('idNumberLabel');
        if (idNumberLabel) idNumberLabel.textContent = translations[currentLanguage].idNumber;

        // Update address section
        const addressTitle = document.getElementById('addressTitle');
        if (addressTitle) addressTitle.textContent = translations[currentLanguage].address;
        
        const streetAddressLabel = document.getElementById('streetAddressLabel');
        if (streetAddressLabel) streetAddressLabel.textContent = translations[currentLanguage].streetAddress;
        
        const cityLabel = document.getElementById('cityLabel');
        if (cityLabel) cityLabel.textContent = translations[currentLanguage].city;
        
        const countryLabel = document.getElementById('countryLabel');
        if (countryLabel) countryLabel.textContent = translations[currentLanguage].country;

        // Update emergency contact section
        const emergencyContactTitle = document.getElementById('emergencyContactTitle');
        if (emergencyContactTitle) emergencyContactTitle.textContent = translations[currentLanguage].emergencyContact;
        
        const emergencyNameLabel = document.getElementById('emergencyNameLabel');
        if (emergencyNameLabel) emergencyNameLabel.textContent = translations[currentLanguage].name;
        
        const relationshipLabel = document.getElementById('relationshipLabel');
        if (relationshipLabel) relationshipLabel.textContent = translations[currentLanguage].relationship;
        
        const emergencyPhoneLabel = document.getElementById('emergencyPhoneLabel');
        if (emergencyPhoneLabel) emergencyPhoneLabel.textContent = translations[currentLanguage].phone;

        // Update appearance section
        const appearanceTitle = document.getElementById('appearanceTitle');
        if (appearanceTitle) appearanceTitle.textContent = translations[currentLanguage].appearance;
        
        const themeLabel = document.getElementById('themeLabel');
        if (themeLabel) themeLabel.textContent = translations[currentLanguage].theme;
        
        const lightThemeLabel = document.getElementById('lightThemeLabel');
        if (lightThemeLabel) lightThemeLabel.textContent = translations[currentLanguage].light;
        
        const darkThemeLabel = document.getElementById('darkThemeLabel');
        if (darkThemeLabel) darkThemeLabel.textContent = translations[currentLanguage].dark;
        
        const languageSettingLabel = document.getElementById('languageSettingLabel');
        if (languageSettingLabel) languageSettingLabel.textContent = translations[currentLanguage].language;

        // Update notifications section
        const notificationsTitle = document.getElementById('notificationsTitle');
        if (notificationsTitle) notificationsTitle.textContent = translations[currentLanguage].notifications;
        
        const emailNotificationsLabel = document.getElementById('emailNotificationsLabel');
        if (emailNotificationsLabel) emailNotificationsLabel.textContent = translations[currentLanguage].emailNotifications;
        
        const smsNotificationsLabel = document.getElementById('smsNotificationsLabel');
        if (smsNotificationsLabel) smsNotificationsLabel.textContent = translations[currentLanguage].smsNotifications;
        
        const appNotificationsLabel = document.getElementById('appNotificationsLabel');
        if (appNotificationsLabel) appNotificationsLabel.textContent = translations[currentLanguage].appNotifications;
        
        const appointmentRemindersLabel = document.getElementById('appointmentRemindersLabel');
        if (appointmentRemindersLabel) appointmentRemindersLabel.textContent = translations[currentLanguage].appointmentReminders;
        
        const medicationRemindersLabel = document.getElementById('medicationRemindersLabel');
        if (medicationRemindersLabel) medicationRemindersLabel.textContent = translations[currentLanguage].medicationReminders;
        
        const resultUpdatesLabel = document.getElementById('resultUpdatesLabel');
        if (resultUpdatesLabel) resultUpdatesLabel.textContent = translations[currentLanguage].resultUpdates;

        // Update privacy section
        const privacyTitle = document.getElementById('privacyTitle');
        if (privacyTitle) privacyTitle.textContent = translations[currentLanguage].privacy;
        
        const shareDataLabel = document.getElementById('shareDataLabel');
        if (shareDataLabel) shareDataLabel.textContent = translations[currentLanguage].shareData;
        
        const researchUseLabel = document.getElementById('researchUseLabel');
        if (researchUseLabel) researchUseLabel.textContent = translations[currentLanguage].researchUse;
        
        const publicProfileLabel = document.getElementById('publicProfileLabel');
        if (publicProfileLabel) publicProfileLabel.textContent = translations[currentLanguage].publicProfile;

        // Update accessibility section
        const accessibilityTitle = document.getElementById('accessibilityTitle');
        if (accessibilityTitle) accessibilityTitle.textContent = translations[currentLanguage].accessibility;
        
        const fontSizeLabel = document.getElementById('fontSizeLabel');
        if (fontSizeLabel) fontSizeLabel.textContent = translations[currentLanguage].fontSize;
        
        const highContrastLabel = document.getElementById('highContrastLabel');
        if (highContrastLabel) highContrastLabel.textContent = translations[currentLanguage].highContrast;
        
        const screenReaderLabel = document.getElementById('screenReaderLabel');
        if (screenReaderLabel) screenReaderLabel.textContent = translations[currentLanguage].screenReader;

        // Update buttons
        const cancelButton = document.getElementById('cancelButton');
        if (cancelButton) cancelButton.textContent = translations[currentLanguage].cancel;
        
        const saveButton = document.getElementById('saveButton');
        if (saveButton) saveButton.textContent = translations[currentLanguage].save;
    }

    // Save changes
    if (saveButton) {
        saveButton.addEventListener('click', () => {
            // Here you would collect all form data and send to backend
            alert('Settings saved successfully!');
        });
    }

    // Cancel changes
    if (cancelButton) {
        cancelButton.addEventListener('click', () => {
            // Reload the page to discard changes
            window.location.reload();
        });
    }

    // Initialize settings
    document.addEventListener('DOMContentLoaded', () => {
        // Load theme preference
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        if (themeToggle) themeToggle.checked = savedTheme === 'dark';

        // Load language preference
        const savedLanguage = localStorage.getItem('language') || 'en';
        changeLanguage(savedLanguage);
    });

    // Listen for theme change events from sidebar
    document.addEventListener('themeChange', (e) => {
        document.documentElement.setAttribute('data-theme', e.detail.theme);
        if (themeToggle) themeToggle.checked = e.detail.theme === 'dark';
    });
}