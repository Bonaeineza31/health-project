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
    
    // Initialize dashboard
    initDashboard();
});

function initDashboard() {
    // DOM Elements
    const updateVitalsBtn = document.getElementById('updateVitalsBtn');
    const vitalsModal = document.getElementById('vitalsModal');
    const cancelVitalsBtn = document.getElementById('cancelVitalsBtn');
    const saveVitalsBtn = document.getElementById('saveVitalsBtn');
    const weekBtn = document.getElementById('weekBtn');
    const monthBtn = document.getElementById('monthBtn');
    const yearBtn = document.getElementById('yearBtn');

    // Vital inputs
    const heartRateInput = document.getElementById('heartRateInput');
    const bloodPressureInput = document.getElementById('bloodPressureInput');
    const temperatureInput = document.getElementById('temperatureInput');
    const oxygenInput = document.getElementById('oxygenInput');
    const weightInput = document.getElementById('weightInput');

    // Vital displays
    const heartRateValue = document.getElementById('heartRateValue');
    const bloodPressureValue = document.getElementById('bloodPressureValue');
    const temperatureValue = document.getElementById('temperatureValue');
    const oxygenValue = document.getElementById('oxygenValue');
    const weightValue = document.getElementById('weightValue');

    // Vital status indicators
    const heartRateStatus = document.getElementById('heartRateStatus');
    const bloodPressureStatus = document.getElementById('bloodPressureStatus');
    const temperatureStatus = document.getElementById('temperatureStatus');
    const oxygenStatus = document.getElementById('oxygenStatus');

    // Language elements
    const welcomeHeader = document.getElementById('welcomeHeader');
    const summaryTitle = document.getElementById('summaryTitle');
    const heartRateLabel = document.getElementById('heartRateLabel');
    const bloodPressureLabel = document.getElementById('bloodPressureLabel');
    const temperatureLabel = document.getElementById('temperatureLabel');
    const oxygenLabel = document.getElementById('oxygenLabel');
    const weightLabel = document.getElementById('weightLabel');
    const historyLabel = document.getElementById('historyLabel');
    const appointmentsTitle = document.getElementById('appointmentsTitle');
    const quickActionsTitle = document.getElementById('quickActionsTitle');
    const scheduleLabel = document.getElementById('scheduleLabel');
    const teleconsultLabel = document.getElementById('teleconsultLabel');
    const uploadLabel = document.getElementById('uploadLabel');
    const findHospitalLabel = document.getElementById('findHospitalLabel');
    const recentActivityTitle = document.getElementById('recentActivityTitle');
    const updateVitalsTitle = document.getElementById('updateVitalsTitle');
    const heartRateModalLabel = document.getElementById('heartRateModalLabel');
    const bloodPressureModalLabel = document.getElementById('bloodPressureModalLabel');
    const temperatureModalLabel = document.getElementById('temperatureModalLabel');
    const oxygenModalLabel = document.getElementById('oxygenModalLabel');
    const weightModalLabel = document.getElementById('weightModalLabel');
    const viewAllAppointmentsBtn = document.getElementById('viewAllAppointmentsBtn');
    const viewAllActivityBtn = document.getElementById('viewAllActivityBtn');

    // State variables
    let currentLanguage = localStorage.getItem('language') || 'en';
    let activeTrend = 'week';

    // Vitals data
    let vitals = {
        heartRate: 72,
        bloodPressure: '120/80',
        temperature: 36.6,
        oxygenLevel: 98,
        weight: 70.5
    };

    // Translations
    const translations = {
        'en': {
            'welcome': 'Welcome to Evuriro Health Dashboard',
            'summary': 'Health Summary',
            'appointments': 'Upcoming Appointments',
            'vitals': 'Latest Vitals',
            'quickActions': 'Quick Actions',
            'scheduleBtn': 'Schedule Appointment',
            'teleconsultBtn': 'Start Teleconsultation',
            'uploadBtn': 'Upload Records',
            'findHospitalBtn': 'Find Hospital',
            'recentActivity': 'Recent Activity',
            'heartRate': 'Heart Rate',
            'bloodPressure': 'Blood Pressure',
            'temperature': 'Temperature',
            'oxygenLevel': 'Oxygen Level',
            'weight': 'Weight',
            'bpm': 'bpm',
            'mmHg': 'mmHg',
            'celsius': '°C',
            'percentage': '%',
            'kg': 'kg',
            'noAppointments': 'No upcoming appointments',
            'bookNow': 'Book Now',
            'viewAll': 'View All',
            'updateVitals': 'Update Vitals',
            'connectDevice': 'Connect Device',
            'history': 'History',
            'week': 'Week',
            'month': 'Month',
            'year': 'Year',
            'save': 'Save',
            'cancel': 'Cancel'
        },
        'fr': {
            'welcome': 'Bienvenue sur le tableau de bord de santé Evuriro',
            'summary': 'Résumé de Santé',
            'appointments': 'Rendez-vous à venir',
            'vitals': 'Constantes Vitales Récentes',
            'quickActions': 'Actions Rapides',
            'scheduleBtn': 'Planifier un Rendez-vous',
            'teleconsultBtn': 'Démarrer une Téléconsultation',
            'uploadBtn': 'Télécharger des Documents',
            'findHospitalBtn': 'Trouver un Hôpital',
            'recentActivity': 'Activité Récente',
            'heartRate': 'Fréquence Cardiaque',
            'bloodPressure': 'Tension Artérielle',
            'temperature': 'Température',
            'oxygenLevel': 'Niveau d\'Oxygène',
            'weight': 'Poids',
            'bpm': 'bpm',
            'mmHg': 'mmHg',
            'celsius': '°C',
            'percentage': '%',
            'kg': 'kg',
            'noAppointments': 'Aucun rendez-vous à venir',
            'bookNow': 'Réserver',
            'viewAll': 'Voir Tout',
            'updateVitals': 'Mettre à jour les constantes',
            'connectDevice': 'Connecter un appareil',
            'history': 'Historique',
            'week': 'Semaine',
            'month': 'Mois',
            'year': 'Année',
            'save': 'Sauvegarder',
            'cancel': 'Annuler'
        },
        'kin': {
            'welcome': 'Murakaza neza kuri Evuriro dashbord y\'ubuzima',
            'summary': 'Incamake y\'Ubuzima',
            'appointments': 'Gahunda zizaza',
            'vitals': 'Ibipimo by\'ubuzima',
            'quickActions': 'Ibikorwa byihuse',
            'scheduleBtn': 'Gufata Gahunda',
            'teleconsultBtn': 'Gutangira Isuzuma kure',
            'uploadBtn': 'Kohereza Inyandiko',
            'findHospitalBtn': 'Gushaka Ibitaro',
            'recentActivity': 'Ibikorwa bya Vuba',
            'heartRate': 'Umutima',
            'bloodPressure': 'Umuvuduko w\'Amaraso',
            'temperature': 'Ubushyuhe',
            'oxygenLevel': 'Urugero rw\'Umwuka',
            'weight': 'Ibiro',
            'bpm': 'bpm',
            'mmHg': 'mmHg',
            'celsius': '°C',
            'percentage': '%',
            'kg': 'kg',
            'noAppointments': 'Nta gahunda zizaza',
            'bookNow': 'Fata Gahunda',
            'viewAll': 'Reba Byose',
            'updateVitals': 'Kuvugurura ibipimo',
            'connectDevice': 'Guhuza ikintu',
            'history': 'Amateka',
            'week': 'Icyumweru',
            'month': 'Ukwezi',
            'year': 'Umwaka',
            'save': 'Kubika',
            'cancel': 'Guhagarika'
        }
    };

    // Update vitals modal
    updateVitalsBtn.addEventListener('click', () => {
        // Set current values in the form
        heartRateInput.value = vitals.heartRate;
        bloodPressureInput.value = vitals.bloodPressure;
        temperatureInput.value = vitals.temperature;
        oxygenInput.value = vitals.oxygenLevel;
        weightInput.value = vitals.weight;

        // Show modal
        vitalsModal.style.display = 'flex';
    });

    // Cancel vitals update
    cancelVitalsBtn.addEventListener('click', () => {
        vitalsModal.style.display = 'none';
    });

    // Save vitals update
    saveVitalsBtn.addEventListener('click', () => {
        // Update vitals data
        vitals.heartRate = parseInt(heartRateInput.value);
        vitals.bloodPressure = bloodPressureInput.value;
        vitals.temperature = parseFloat(temperatureInput.value);
        vitals.oxygenLevel = parseInt(oxygenInput.value);
        vitals.weight = parseFloat(weightInput.value);

        // Update display
        updateVitalsDisplay();

        // Hide modal
        vitalsModal.style.display = 'none';
    });

    // Update vitals display
    function updateVitalsDisplay() {
        // Update values
        heartRateValue.textContent = `${vitals.heartRate} ${translations[currentLanguage].bpm}`;
        bloodPressureValue.textContent = `${vitals.bloodPressure} ${translations[currentLanguage].mmHg}`;
        temperatureValue.textContent = `${vitals.temperature} ${translations[currentLanguage].celsius}`;
        oxygenValue.textContent = `${vitals.oxygenLevel}${translations[currentLanguage].percentage}`;
        weightValue.textContent = `${vitals.weight} ${translations[currentLanguage].kg}`;

        // Update status indicators
        updateVitalStatus('heartRate', vitals.heartRate, heartRateStatus);
        updateVitalStatus('bloodPressure', vitals.bloodPressure, bloodPressureStatus);
        updateVitalStatus('temperature', vitals.temperature, temperatureStatus);
        updateVitalStatus('oxygenLevel', vitals.oxygenLevel, oxygenStatus);
    }

    // Update vital status indicator
    function updateVitalStatus(type, value, element) {
        let status = 'normal';

        switch (type) {
            case 'heartRate':
                status = value < 60 || value > 100 ? 'warning' : 'normal';
                break;
            case 'bloodPressure':
                const [systolic, diastolic] = value.split('/').map(Number);
                status = (systolic > 140 || diastolic > 90) ? 'warning' : 'normal';
                break;
            case 'temperature':
                status = value < 36 || value > 37.5 ? 'warning' : 'normal';
                break;
            case 'oxygenLevel':
                status = value < 95 ? 'warning' : 'normal';
                break;
        }

        // Remove all status classes
        element.classList.remove('normal', 'warning', 'critical');
        // Add the appropriate status class
        element.classList.add(status);
    }

    // Trend period buttons
    weekBtn.addEventListener('click', () => setActiveTrend('week'));
    monthBtn.addEventListener('click', () => setActiveTrend('month'));
    yearBtn.addEventListener('click', () => setActiveTrend('year'));

    // Set active trend period
    function setActiveTrend(period) {
        activeTrend = period;

        // Update active button
        weekBtn.classList.remove('active');
        monthBtn.classList.remove('active');
        yearBtn.classList.remove('active');

        if (period === 'week') weekBtn.classList.add('active');
        if (period === 'month') monthBtn.classList.add('active');
        if (period === 'year') yearBtn.classList.add('active');
    }

    // Change language function
    function changeLanguage(lang) {
        currentLanguage = lang;
        
        // Update all text elements
        updateTranslations();

        // Save to localStorage
        localStorage.setItem('language', lang);
    }

    // Update translations
    function updateTranslations() {
        const text = translations[currentLanguage];

        // Update page title
        welcomeHeader.textContent = text.welcome;

        // Update health summary section
        summaryTitle.textContent = text.summary;
        heartRateLabel.textContent = text.heartRate;
        bloodPressureLabel.textContent = text.bloodPressure;
        temperatureLabel.textContent = text.temperature;
        oxygenLabel.textContent = text.oxygenLevel;
        weightLabel.textContent = text.weight;

        // Update vitals display
        heartRateValue.textContent = `${vitals.heartRate} ${text.bpm}`;
        bloodPressureValue.textContent = `${vitals.bloodPressure} ${text.mmHg}`;
        temperatureValue.textContent = `${vitals.temperature} ${text.celsius}`;
        oxygenValue.textContent = `${vitals.oxygenLevel}${text.percentage}`;
        weightValue.textContent = `${vitals.weight} ${text.kg}`;

        // Update buttons
        updateVitalsBtn.textContent = text.updateVitals;
        document.querySelector('.connect-device-btn').textContent = text.connectDevice;

        // Update history section
        historyLabel.textContent = text.history;
        weekBtn.textContent = text.week;
        monthBtn.textContent = text.month;
        yearBtn.textContent = text.year;

        // Update appointments section
        appointmentsTitle.textContent = text.appointments;
        viewAllAppointmentsBtn.textContent = text.viewAll;

        // Update quick actions section
        quickActionsTitle.textContent = text.quickActions;
        scheduleLabel.textContent = text.scheduleBtn;
        teleconsultLabel.textContent = text.teleconsultBtn;
        uploadLabel.textContent = text.uploadBtn;
        findHospitalLabel.textContent = text.findHospitalBtn;

        // Update recent activity section
        recentActivityTitle.textContent = text.recentActivity;
        viewAllActivityBtn.textContent = text.viewAll;

        // Update modal
        updateVitalsTitle.textContent = text.updateVitals;
        heartRateModalLabel.textContent = text.heartRate;
        bloodPressureModalLabel.textContent = text.bloodPressure;
        temperatureModalLabel.textContent = text.temperature;
        oxygenModalLabel.textContent = text.oxygenLevel;
        weightModalLabel.textContent = text.weight;
        cancelVitalsBtn.textContent = text.cancel;
        saveVitalsBtn.textContent = text.save;
    }

    // Listen for language change events from navbar
    document.addEventListener('languageChange', (e) => {
        changeLanguage(e.detail.language);
    });
    document.addEventListener('themeChange', (e) => {
        document.documentElement.setAttribute('data-theme', e.detail.theme);
    });

    updateVitalsDisplay();
    updateTranslations();
}