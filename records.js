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
    
    // Initialize medical records
    initMedicalRecords();
});

function initMedicalRecords() {
    // DOM Elements - Navigation
    const profileDropdown = document.getElementById('profileDropdown');
    const profileMenu = document.getElementById('profileMenu');
    const darkModeToggle = document.getElementById('darkModeToggle');

    // DOM Elements - Tabs
    const recentTab = document.getElementById('recentTab');
    const labResultsTab = document.getElementById('labResultsTab');
    const medicationsTab = document.getElementById('medicationsTab');
    const diagnosesTab = document.getElementById('diagnosesTab');
    const visitsTab = document.getElementById('visitsTab');

    const recentContent = document.getElementById('recentContent');
    const labResultsContent = document.getElementById('labResultsContent');
    const medicationsContent = document.getElementById('medicationsContent');
    const diagnosesContent = document.getElementById('diagnosesContent');
    const visitsContent = document.getElementById('visitsContent');

    // DOM Elements - Search
    const recordSearchInput = document.getElementById('recordSearchInput');
    const recordSearchBtn = document.getElementById('recordSearchBtn');

    // DOM Elements - Modal
    const recordModal = document.getElementById('recordModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const closeModalFooterBtn = document.getElementById('closeModalFooterBtn');

    // DOM Elements - Footer Actions
    const downloadAllBtn = document.getElementById('downloadAllBtn');
    const shareProviderBtn = document.getElementById('shareProviderBtn');
    const printRecordsBtn = document.getElementById('printRecordsBtn');

    // State variables
    let activeTab = 'recent';
    let downloadStatus = {};

    // Medical data
    const medicalData = {
        labResults: [
            { id: 1, date: 'February 28, 2025', type: 'Blood Work', doctor: 'Dr. Mugabo Jean', description: 'Lipid Panel', status: 'Reviewed', results: 'Total Cholesterol: 210mg/dL, HDL: 45mg/dL, LDL: 130mg/dL, Triglycerides: 180mg/dL' },
            { id: 4, date: 'January 28, 2025', type: 'Blood Work', doctor: 'Dr. Mugabo Jean', description: 'CBC', status: 'Reviewed', results: 'WBC: 7.5, RBC: 4.8, Hemoglobin: 14.2g/dL, Platelets: 250' },
            { id: 5, date: 'December 12, 2024', type: 'Urinalysis', doctor: 'Dr. Uwase Marie', description: 'Routine Urinalysis', status: 'Reviewed', results: 'No abnormalities detected' },
        ],
        medications: [
            { id: 2, date: 'February 22, 2025', name: 'Lisinopril', dosage: '10mg', instructions: 'Take once daily', prescriber: 'Dr. Mugabo Jean', refills: 3, endDate: 'August 22, 2025' },
            { id: 6, date: 'January 15, 2025', name: 'Atorvastatin', dosage: '20mg', instructions: 'Take once daily at bedtime', prescriber: 'Dr. Mugabo Jean', refills: 2, endDate: 'July 15, 2025' },
            { id: 7, date: 'December 05, 2024', name: 'Metformin', dosage: '500mg', instructions: 'Take twice daily with meals', prescriber: 'Dr. Uwase Marie', refills: 0, endDate: 'June 05, 2025' },
        ],
        diagnoses: [
            { id: 3, date: 'February 15, 2025', name: 'Hypertension - Stage 1', doctor: 'Dr. Mugabo Jean', status: 'Active', notes: 'Monitor BP regularly, follow up in 1 month' },
            { id: 8, date: 'December 05, 2024', name: 'Type 2 Diabetes', doctor: 'Dr. Uwase Marie', status: 'Active', notes: 'A1C: 6.8%, Follow DASH diet, increase physical activity' },
            { id: 9, date: 'October 10, 2024', name: 'Seasonal Allergies', doctor: 'Dr. Nkusi Patrick', status: 'Intermittent', notes: 'Use antihistamines as needed during high pollen seasons' },
        ],
        visits: [
            { id: 10, date: 'February 15, 2025', type: 'Cardiology', doctor: 'Dr. Mugabo Jean', reason: 'Hypertension Follow-up', summary: 'BP readings still elevated, medication adjusted, follow up in 1 month' },
            { id: 11, date: 'December 05, 2024', type: 'Primary Care', doctor: 'Dr. Uwase Marie', reason: 'Annual Physical', summary: 'Discovered elevated blood glucose, diagnosed Type 2 Diabetes, started on medication' },
            { id: 12, date: 'October 10, 2024', type: 'Allergy & Immunology', doctor: 'Dr. Nkusi Patrick', reason: 'Persistent Sneezing', summary: 'Diagnosed with seasonal allergies, prescribed antihistamines' },
        ],
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

    // Dark mode toggle
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            toggleDarkMode();
        });
    }

    // Toggle dark mode function
    function toggleDarkMode() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        if (isDark) {
            document.documentElement.setAttribute('data-theme', 'light');
            if (darkModeToggle) {
                darkModeToggle.innerHTML = '<i class="fa fa-moon-o"></i><span>Dark Mode</span>';
            }
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
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

    // Tab switching
    if (recentTab) {
        recentTab.addEventListener('click', () => switchTab('recent'));
    }
    if (labResultsTab) {
        labResultsTab.addEventListener('click', () => switchTab('labResults'));
    }
    if (medicationsTab) {
        medicationsTab.addEventListener('click', () => switchTab('medications'));
    }
    if (diagnosesTab) {
        diagnosesTab.addEventListener('click', () => switchTab('diagnoses'));
    }
    if (visitsTab) {
        visitsTab.addEventListener('click', () => switchTab('visits'));
    }

    // Tab switching function
    function switchTab(tabName) {
        // Hide all tab contents
        recentContent.style.display = 'none';
        labResultsContent.style.display = 'none';
        medicationsContent.style.display = 'none';
        diagnosesContent.style.display = 'none';
        visitsContent.style.display = 'none';

        // Remove active class from all tabs
        recentTab.classList.remove('med-active');
        labResultsTab.classList.remove('med-active');
        medicationsTab.classList.remove('med-active');
        diagnosesTab.classList.remove('med-active');
        visitsTab.classList.remove('med-active');

        // Show selected tab content and add active class
        activeTab = tabName;

        if (tabName === 'recent') {
            recentContent.style.display = 'grid';
            recentTab.classList.add('med-active');
        } else if (tabName === 'labResults') {
            labResultsContent.style.display = 'grid';
            labResultsTab.classList.add('med-active');
        } else if (tabName === 'medications') {
            medicationsContent.style.display = 'grid';
            medicationsTab.classList.add('med-active');
        } else if (tabName === 'diagnoses') {
            diagnosesContent.style.display = 'grid';
            diagnosesTab.classList.add('med-active');
        } else if (tabName === 'visits') {
            visitsContent.style.display = 'grid';
            visitsTab.classList.add('med-active');
        }
    }

    // Search functionality
    if (recordSearchBtn) {
        recordSearchBtn.addEventListener('click', handleSearch);
    }
    
    if (recordSearchInput) {
        recordSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }

    function handleSearch() {
        const searchQuery = recordSearchInput.value.trim().toLowerCase();

        if (!searchQuery) {
            // If search is empty, show all records
            showAllRecords();
            return;
        }

        // Filter records based on search query
        filterRecords(searchQuery);
    }

    function showAllRecords() {
        // Show all records in the current active tab
        const allCards = document.querySelectorAll(`#${activeTab}Content .med-record-card`);
        allCards.forEach(card => {
            card.style.display = 'block';
        });
    }

    function filterRecords(query) {
        // Filter records in the current active tab
        const allCards = document.querySelectorAll(`#${activeTab}Content .med-record-card`);

        allCards.forEach(card => {
            const cardText = card.textContent.toLowerCase();
            if (cardText.includes(query)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // View details buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('med-btn-view')) {
            const id = e.target.getAttribute('data-id');
            const type = e.target.getAttribute('data-type');

            showRecordDetails(id, type);
        }
    });

    function showRecordDetails(id, type) {
        let record;

        // Find the record based on type and id
        if (type === 'labResult') {
            record = medicalData.labResults.find(item => item.id == id);
            modalTitle.textContent = `${record.type} Results`;
        } else if (type === 'medication') {
            record = medicalData.medications.find(item => item.id == id);
            modalTitle.textContent = `${record.name} ${record.dosage}`;
        } else if (type === 'diagnosis') {
            record = medicalData.diagnoses.find(item => item.id == id);
            modalTitle.textContent = record.name;
        } else if (type === 'visit') {
            record = medicalData.visits.find(item => item.id == id);
            modalTitle.textContent = `${record.type} Visit`;
        }

        if (record) {
            // Generate modal content
            let modalContent = '';

            for (const [key, value] of Object.entries(record)) {
                if (key !== 'id' && key !== 'type' && key !== 'name') {
                    const formattedKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
                    modalContent += `
                        <div class="med-modal-item">
                            <strong>${formattedKey}:</strong> ${value}
                        </div>
                    `;
                }
            }

            modalBody.innerHTML = modalContent;
            recordModal.style.display = 'flex';
        }
    }

    // Close modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            recordModal.style.display = 'none';
        });
    }

    if (closeModalFooterBtn) {
        closeModalFooterBtn.addEventListener('click', () => {
            recordModal.style.display = 'none';
        });
    }

    if (recordModal) {
        recordModal.addEventListener('click', (e) => {
            if (e.target === recordModal) {
                recordModal.style.display = 'none';
            }
        });
    }

    // Download buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('med-btn-download')) {
            const id = e.target.getAttribute('data-id');
            handleDownload(id, e.target);
        }
    });

    function handleDownload(id, button) {
        // Set downloading state
        button.classList.add('med-btn-downloading');
        button.textContent = '...';
        button.disabled = true;

        // Simulate download
        setTimeout(() => {
            // Set completed state
            button.classList.remove('med-btn-downloading');
            button.classList.add('med-btn-completed');
            button.textContent = '✓';

            // Reset after 2 seconds
            setTimeout(() => {
                button.classList.remove('med-btn-completed');
                button.textContent = 'Download';
                button.disabled = false;
            }, 2000);
        }, 1500);
    }

    // Footer action buttons
    if (downloadAllBtn) {
        downloadAllBtn.addEventListener('click', () => {
            alert('Downloading all medical records as PDF...');
        });
    }

    if (shareProviderBtn) {
        shareProviderBtn.addEventListener('click', () => {
            alert('Please select a healthcare provider to share your records with.');
        });
    }

    if (printRecordsBtn) {
        printRecordsBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // Medication actions
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('med-btn-refill')) {
            const id = e.target.getAttribute('data-id');
            const medication = medicalData.medications.find(item => item.id == id);

            if (medication) {
                alert(`Requesting refill for ${medication.name} ${medication.dosage}`);
            }
        } else if (e.target.classList.contains('med-btn-reminder')) {
            const id = e.target.getAttribute('data-id');
            const medication = medicalData.medications.find(item => item.id == id);

            if (medication) {
                alert(`Setting reminder for ${medication.name} ${medication.dosage}`);
            }
        }
    });

    // Diagnosis actions
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('med-btn-info')) {
            const id = e.target.getAttribute('data-id');
            const diagnosis = medicalData.diagnoses.find(item => item.id == id);

            if (diagnosis) {
                window.open(`https://example.com/conditions/${diagnosis.name.toLowerCase().replace(/ /g, '-')}`, '_blank');
            }
        } else if (e.target.classList.contains('med-btn-track')) {
            const id = e.target.getAttribute('data-id');
            const diagnosis = medicalData.diagnoses.find(item => item.id == id);

            if (diagnosis) {
                alert(`Opening symptom tracker for ${diagnosis.name}`);
            }
        }
    });

    // Visit actions
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('med-btn-follow')) {
            const id = e.target.getAttribute('data-id');
            const visit = medicalData.visits.find(item => item.id == id);

            if (visit) {
                alert(`Scheduling follow-up appointment with ${visit.doctor}`);
            }
        }
    });

    // Listen for theme change events from sidebar
    document.addEventListener('themeChange', (e) => {
        document.documentElement.setAttribute('data-theme', e.detail.theme);
    });

    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
        // Load theme preference
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);

        // Update dark mode toggle icon based on current theme
        if (darkModeToggle) {
            if (savedTheme === 'dark') {
                darkModeToggle.innerHTML = '<i class="fa fa-sun-o"></i><span>Light Mode</span>';
            } else {
                darkModeToggle.innerHTML = '<i class="fa fa-moon-o"></i><span>Dark Mode</span>';
            }
        }
    });
}