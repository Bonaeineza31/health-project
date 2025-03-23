// dashboard.js - Handles all functionality for the Evruriro Health Dashboard

document.addEventListener('DOMContentLoaded', function() {
    // Load components
    loadNavbar();
    loadSidebar();
    
    // Check authentication status
    const isGuest = localStorage.getItem('guestMode') === 'true';
    const token = localStorage.getItem('token');
    
    if (isGuest) {
        // Handle guest mode
        loadSampleData();
        showGuestBanner();
    } else if (!token) {
        // Redirect to login if not authenticated and not in guest mode
        window.location.href = 'welcome.html';
    } else {
        // Load authenticated user data
        loadUserData();
    }
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize charts
    initializeCharts();
});

// Load the navbar component
function loadNavbar() {
    const navbarContainer = document.getElementById('navbar-container');
    if (navbarContainer) {
        navbarContainer.innerHTML = `
            <nav class="navbar">
                <div class="logo">
                    <a href="dashboard.html">
                        <img src="images/logo.png" alt="Evruriro Logo">
                        <span>Evruriro Health</span>
                    </a>
                </div>
                <div class="navbar-search">
                    <i class="fa fa-search"></i>
                    <input type="text" placeholder="Search...">
                </div>
                <div class="navbar-actions">
                    <button class="notification-btn">
                        <i class="fa fa-bell"></i>
                        <span class="badge">3</span>
                    </button>
                    <div class="user-menu">
                        <button class="user-btn">
                            <img src="images/avatar-placeholder.png" alt="User Avatar">
                            <span id="userName">User</span>
                            <i class="fa fa-chevron-down"></i>
                        </button>
                        <div class="dropdown-menu">
                            <a href="profile.html"><i class="fa fa-user"></i> Profile</a>
                            <a href="settings.html"><i class="fa fa-cog"></i> Settings</a>
                            <a href="#" id="logoutBtn"><i class="fa fa-sign-out"></i> Logout</a>
                        </div>
                    </div>
                </div>
            </nav>
        `;
        
        // Set username if available
        const userEmail = localStorage.getItem('userEmail');
        const userName = document.getElementById('userName');
        if (userName && userEmail) {
            userName.textContent = userEmail.split('@')[0];
        }
        
        // Setup logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                logout();
            });
        }
        
        // Setup dropdown toggle
        const userBtn = document.querySelector('.user-btn');
        if (userBtn) {
            userBtn.addEventListener('click', function() {
                document.querySelector('.dropdown-menu').classList.toggle('show');
            });
        }
    }
}

// Load the sidebar component
function loadSidebar() {
    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer) {
        sidebarContainer.innerHTML = `
            <div class="sidebar">
                <ul class="sidebar-menu">
                    <li class="sidebar-item active">
                        <a href="dashboard.html">
                            <i class="fa fa-dashboard"></i>
                            <span>Dashboard</span>
                        </a>
                    </li>
                    <li class="sidebar-item">
                        <a href="appointments.html">
                            <i class="fa fa-calendar"></i>
                            <span>Appointments</span>
                        </a>
                    </li>
                    <li class="sidebar-item">
                        <a href="teleconsultation.html">
                            <i class="fa fa-video-camera"></i>
                            <span>Teleconsultation</span>
                        </a>
                    </li>
                    <li class="sidebar-item">
                        <a href="records.html">
                            <i class="fa fa-file-medical-alt"></i>
                            <span>Medical Records</span>
                        </a>
                    </li>
                    <li class="sidebar-item">
                        <a href="prescriptions.html">
                            <i class="fa fa-prescription"></i>
                            <span>Prescriptions</span>
                        </a>
                    </li>
                    <li class="sidebar-item">
                        <a href="hospitals.html">
                            <i class="fa fa-hospital-o"></i>
                            <span>Find Hospital</span>
                        </a>
                    </li>
                    <li class="sidebar-item">
                        <a href="profile.html">
                            <i class="fa fa-user"></i>
                            <span>Profile</span>
                        </a>
                    </li>
                    <li class="sidebar-item">
                        <a href="settings.html">
                            <i class="fa fa-cog"></i>
                            <span>Settings</span>
                        </a>
                    </li>
                </ul>
                <div class="sidebar-footer">
                    <a href="help.html">
                        <i class="fa fa-question-circle"></i>
                        <span>Help & Support</span>
                    </a>
                </div>
            </div>
        `;
    }
}

// Display a banner for guest mode
function showGuestBanner() {
    const banner = document.createElement('div');
    banner.className = 'guest-banner';
    banner.innerHTML = 'You are browsing in Guest Mode. <a href="welcome.html">Sign in</a> to access your personal data.';
    
    const contentContainer = document.querySelector('.content-container');
    if (contentContainer) {
        contentContainer.prepend(banner);
    }
}

// Load sample data for guest users
function loadSampleData() {
    // Set vital signs data
    updateElementText('heartRate', '72 bpm');
    updateElementText('bloodPressure', '120/80 mmHg');
    updateElementText('temperature', '36.6 °C');
    updateElementText('oxygenLevel', '98%');
    updateElementText('weight', '70.5 kg');
    
    // Load sample appointments
    const appointmentsList = document.getElementById('appointmentsList');
    if (appointmentsList) {
        appointmentsList.innerHTML = `
            <div class="appointment-item">
                <div class="appointment-date">
                    <span class="day">15</span>
                    <span class="month">Apr</span>
                </div>
                <div class="appointment-details">
                    <h3>General Checkup</h3>
                    <p>Dr. Sarah Johnson</p>
                    <p>10:00 AM - 10:30 AM</p>
                </div>
                <div class="appointment-actions">
                    <button class="btn secondary">Reschedule</button>
                </div>
            </div>
            <div class="appointment-item">
                <div class="appointment-date">
                    <span class="day">22</span>
                    <span class="month">Apr</span>
                </div>
                <div class="appointment-details">
                    <h3>Dental Consultation</h3>
                    <p>Dr. Michael Chen</p>
                    <p>2:00 PM - 3:00 PM</p>
                </div>
                <div class="appointment-actions">
                    <button class="btn secondary">Reschedule</button>
                </div>
            </div>
        `;
    }
    
    // Load sample activity
    const activityList = document.getElementById('activityList');
    if (activityList) {
        activityList.innerHTML = `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fa fa-calendar-check-o"></i>
                </div>
                <div class="activity-details">
                    <p>Appointment confirmed with Dr. Sarah Johnson</p>
                    <span class="activity-time">2 days ago</span>
                </div>
            </div>
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fa fa-file-text-o"></i>
                </div>
                <div class="activity-details">
                    <p>Lab results uploaded</p>
                    <span class="activity-time">5 days ago</span>
                </div>
            </div>
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fa fa-medkit"></i>
                </div>
                <div class="activity-details">
                    <p>Prescription renewed</p>
                    <span class="activity-time">1 week ago</span>
                </div>
            </div>
        `;
    }
}

// Load real user data from the backend
async function loadUserData() {
    const token = localStorage.getItem('token');
    const API_URL = 'https://evuriro-backend.onrender.com';
    
    try {
        // Fetch user profile
        const profileResponse = await fetch(`${API_URL}/user/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!profileResponse.ok) {
            throw new Error('Failed to fetch user profile');
        }
        
        const profileData = await profileResponse.json();
        
        // Update user name in navbar
        const userName = document.getElementById('userName');
        if (userName && profileData.name) {
            userName.textContent = profileData.name;
        }
        
        // TODO: Fetch and display real vital signs, appointments, and activity
        // For now, use sample data until backend endpoints are available
        loadSampleData();
        
    } catch (error) {
        console.error('Error loading user data:', error);
        // If there's an error fetching user data, fall back to sample data
        loadSampleData();
    }
}

// Set up event listeners for the dashboard
function setupEventListeners() {
    // Update vitals button
    const updateVitalsBtn = document.getElementById('updateVitals');
    if (updateVitalsBtn) {
        updateVitalsBtn.addEventListener('click', function() {
            alert('This feature will allow you to manually update your vital signs.');
        });
    }
    
    // Connect device button
    const connectDeviceBtn = document.getElementById('connectDevice');
    if (connectDeviceBtn) {
        connectDeviceBtn.addEventListener('click', function() {
            alert('This feature will allow you to connect health monitoring devices.');
        });
    }
    
    // Chart tabs
    const chartTabs = document.querySelectorAll('.chart-tab');
    chartTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            chartTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            // Update chart data based on selected time period
            updateChartData(this.textContent.trim());
        });
    });
    
    // View tabs for appointments
    const viewTabs = document.querySelectorAll('.view-tab');
    viewTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            viewTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            // Update appointments list based on selected view
            updateAppointmentsView(this.textContent.trim());
        });
    });
}

// Initialize charts for the dashboard
function initializeCharts() {
    const chartContainer = document.getElementById('vitalsChart');
    if (chartContainer) {
        // Draw a simple chart using HTML/CSS for now
        // This would normally use a chart library like Chart.js
        chartContainer.innerHTML = `
            <div class="dummy-chart">
                <div class="chart-placeholder">
                    <div class="chart-bar" style="height: 60%;" title="Week 1: 72bpm"></div>
                    <div class="chart-bar" style="height: 75%;" title="Week 2: 75bpm"></div>
                    <div class="chart-bar" style="height: 70%;" title="Week 3: 73bpm"></div>
                    <div class="chart-bar" style="height: 65%;" title="Week 4: 71bpm"></div>
                </div>
                <div class="chart-labels">
                    <span>Week 1</span>
                    <span>Week 2</span>
                    <span>Week 3</span>
                    <span>Week 4</span>
                </div>
            </div>
        `;
    }
}

// Update chart data based on selected time period
function updateChartData(period) {
    console.log(`Updating chart for period: ${period}`);
    // This would normally fetch and display data for the selected period
    // For now, we'll just log the action
}

// Update appointments list based on selected view
function updateAppointmentsView(view) {
    console.log(`Updating appointments view: ${view}`);
    // This would normally fetch and display appointments based on the selected view
    // For now, we'll just log the action
}

// Helper function to update text content of an element
function updateElementText(id, text) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = text;
    }
}

// Handle logout
function logout() {
    // Clear all stored data
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('guestMode');
    
    // Redirect to welcome page
    window.location.href = 'welcome.html';
}

// Close dropdown menus when clicking outside
document.addEventListener('click', function(e) {
    const dropdowns = document.querySelectorAll('.dropdown-menu');
    dropdowns.forEach(dropdown => {
        if (!e.target.closest('.user-menu') && dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
        }
    });
});