
const AppState = {
    theme: localStorage.getItem('evruriTheme') || 'light',
    language: localStorage.getItem('evruriLanguage') || 'en',
    isLoggedIn: !!sessionStorage.getItem('evruriUserToken'),
    userInfo: JSON.parse(sessionStorage.getItem('evruriUserInfo') || '{}')
  };
  
  // Available languages
  const LANGUAGES = {
    'en': { name: 'English', code: 'en' },
    'kin': { name: 'Kinyarwanda', code: 'kin' },
    'fr': { name: 'Français', code: 'fr' }
  };
  
  // DOM Ready Handler
  document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    applyTheme(AppState.theme);
    
    // Load components
    loadNavbar();
    loadSidebar();
    
    // Setup event listeners
    setupThemeToggle();
    setupLanguageSelector();
    setupMobileMenu();
    
    // Check authentication status
    checkAuthStatus();
  });
  
  /**
   * Theme Management
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
      themeToggle.innerHTML = theme === 'dark' ? '<i class="fa fa-sun-o"></i>' : '<i class="fa fa-moon-o"></i>';
    }
  }
  
  function toggleTheme() {
    const newTheme = AppState.theme === 'light' ? 'dark' : 'light';
    AppState.theme = newTheme;
    localStorage.setItem('evruriTheme', newTheme);
    applyTheme(newTheme);
  }
  
  function setupThemeToggle() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('.theme-toggle')) {
        toggleTheme();
      }
    });
  }
  
  /**
   * Language Management
   */
  function changeLanguage(langCode) {
    if (LANGUAGES[langCode]) {
      AppState.language = langCode;
      localStorage.setItem('evruriLanguage', langCode);
      updateUILanguage(langCode);
    }
  }
  
  function updateUILanguage(langCode) {
    // This would normally fetch translation files and update the UI
    console.log(`Language changed to ${LANGUAGES[langCode].name}`);
    
    // For a real implementation, you would load language files and replace text
    // For now, we'll just update the language selector UI
    const langSelector = document.querySelector('.language-selector .current-lang');
    if (langSelector) {
      langSelector.textContent = LANGUAGES[langCode].name;
    }
  }
  
  function setupLanguageSelector() {
    document.addEventListener('click', (e) => {
      const langOption = e.target.closest('.lang-option');
      if (langOption) {
        const langCode = langOption.dataset.lang;
        changeLanguage(langCode);
      }
      
      // Toggle language dropdown
      const langSelector = e.target.closest('.language-selector');
      if (langSelector) {
        const dropdown = langSelector.querySelector('.lang-dropdown');
        if (dropdown) {
          dropdown.classList.toggle('show');
        }
      }
    });
  }
  
  /**
   * Component Loading
   */
  function loadNavbar() {
    const navbarContainer = document.getElementById('navbar-container');
    if (!navbarContainer) return;
    
    navbarContainer.innerHTML = `
      <nav class="navbar">
        <div class="navbar-left">
          <button class="mobile-menu-toggle">
            <i class="fa fa-bars"></i>
          </button>
          <a href="index.html" class="logo">
            <span class="logo-text">Evruriro</span>
            <span class="logo-tagline">Healthcare</span>
          </a>
        </div>
        <div class="navbar-center">
          <div class="nav-links">
            <a href="index.html" class="nav-link">Home</a>
            <a href="appointments.html" class="nav-link">Appointments</a>
            <a href="records.html" class="nav-link">Health Records</a>
            <a href="messages.html" class="nav-link">Messages</a>
            <a href="prescriptions.html" class="nav-link">Prescriptions</a>
          </div>
        </div>
        <div class="navbar-right">
          <button class="theme-toggle">
            ${AppState.theme === 'dark' ? '<i class="fa fa-sun-o"></i>' : '<i class="fa fa-moon-o"></i>'}
          </button>
          <div class="language-selector">
            <div class="current-lang">${LANGUAGES[AppState.language].name}</div>
            <div class="lang-dropdown">
              ${Object.values(LANGUAGES).map(lang => 
                `<div class="lang-option" data-lang="${lang.code}">${lang.name}</div>`
              ).join('')}
            </div>
          </div>
          <div class="user-menu">
            <button class="user-menu-toggle">
              <i class="fa fa-user-circle"></i>
            </button>
            <div class="user-dropdown">
              <a href="profile.html" class="dropdown-item">My Profile</a>
              <a href="settings.html" class="dropdown-item">Settings</a>
              <div class="dropdown-divider"></div>
              <a href="#" class="dropdown-item logout-btn">Logout</a>
            </div>
          </div>
        </div>
      </nav>
    `;
    
    // Setup dropdown toggles
    document.querySelectorAll('.user-menu-toggle').forEach(toggle => {
      toggle.addEventListener('click', () => {
        document.querySelector('.user-dropdown').classList.toggle('show');
      });
    });
    
    // Setup logout button
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
      });
    }
  }
  
  function loadSidebar() {
    const sidebarContainer = document.getElementById('sidebar-container');
    if (!sidebarContainer) return;
    
    sidebarContainer.innerHTML = `
      <aside class="sidebar">
        <div class="sidebar-header">
          <h3>Quick Actions</h3>
        </div>
        <ul class="sidebar-menu">
          <li class="sidebar-item">
            <a href="appointments.html" class="sidebar-link">
              <i class="fa fa-calendar"></i>
              <span>Schedule Appointment</span>
            </a>
          </li>
          <li class="sidebar-item">
            <a href="messages.html" class="sidebar-link">
              <i class="fa fa-envelope"></i>
              <span>Message Provider</span>
            </a>
          </li>
          <li class="sidebar-item">
            <a href="records.html" class="sidebar-link">
              <i class="fa fa-file-medical"></i>
              <span>View Health Records</span>
            </a>
          </li>
          <li class="sidebar-item">
            <a href="prescriptions.html" class="sidebar-link">
              <i class="fa fa-prescription-bottle"></i>
              <span>Refill Prescription</span>
            </a>
          </li>
        </ul>
        <div class="sidebar-section">
          <h4>Upcoming Appointments</h4>
          <div class="upcoming-appointments" id="upcomingAppointments">
            <div class="appointment-card">
              <div class="appointment-date">Mar 26, 2025</div>
              <div class="appointment-doctor">Dr. Sarah Johnson</div>
              <div class="appointment-type">Virtual Visit</div>
            </div>
          </div>
        </div>
      </aside>
    `;
  }
  
  /**
   * Mobile Responsiveness
   */
  function setupMobileMenu() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('.mobile-menu-toggle')) {
        document.querySelector('.sidebar').classList.toggle('show-mobile');
      }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.sidebar') && !e.target.closest('.mobile-menu-toggle')) {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar && sidebar.classList.contains('show-mobile')) {
          sidebar.classList.remove('show-mobile');
        }
      }
    });
  }
  
  /**
   * Authentication
   */
  function checkAuthStatus() {
    if (!AppState.isLoggedIn && !isPublicPage()) {
      redirectToLogin();
    }
    
    updateAuthUI();
  }
  
  function isPublicPage() {
    const publicPages = ['login.html', 'register.html', 'forgot-password.html'];
    const currentPage = window.location.pathname.split('/').pop();
    return publicPages.includes(currentPage);
  }
  
  function updateAuthUI() {
    const authElements = document.querySelectorAll('.auth-dependent');
    authElements.forEach(el => {
      el.style.display = AppState.isLoggedIn ? 'block' : 'none';
    });
    
    const guestElements = document.querySelectorAll('.guest-only');
    guestElements.forEach(el => {
      el.style.display = AppState.isLoggedIn ? 'none' : 'block';
    });
    
    // Update user name if logged in
    if (AppState.isLoggedIn && AppState.userInfo.name) {
      const userNameElements = document.querySelectorAll('.user-name');
      userNameElements.forEach(el => {
        el.textContent = AppState.userInfo.name;
      });
    }
  }
  
  function login(token, userInfo) {
    sessionStorage.setItem('evruriUserToken', token);
    sessionStorage.setItem('evruriUserInfo', JSON.stringify(userInfo));
    AppState.isLoggedIn = true;
    AppState.userInfo = userInfo;
    updateAuthUI();
    window.location.href = 'index.html';
  }
  
  function logout() {
    sessionStorage.removeItem('evruriUserToken');
    sessionStorage.removeItem('evruriUserInfo');
    AppState.isLoggedIn = false;
    AppState.userInfo = {};
    redirectToLogin();
  }
  
  function redirectToLogin() {
    window.location.href = 'login.html';
  }
  
  /**
   * API Utilities
   */
  const API = {
    baseUrl: 'https://api.evruriro.com/v1',
    
    // Get authentication headers
    getHeaders() {
      const headers = {
        'Content-Type': 'application/json'
      };
      
      const token = sessionStorage.getItem('evruriUserToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      return headers;
    },
    
    // General fetch wrapper
    async fetch(endpoint, options = {}) {
      const url = `${this.baseUrl}${endpoint}`;
      const headers = this.getHeaders();
      
      try {
        const response = await fetch(url, {
          headers,
          ...options
        });
        
        // Handle authentication errors
        if (response.status === 401) {
          logout();
          throw new Error('Your session has expired. Please login again.');
        }
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('API Request Failed:', error);
        showNotification('error', error.message || 'An error occurred while communicating with the server');
        throw error;
      }
    },
    
    // Helper methods for common requests
    get(endpoint) {
      return this.fetch(endpoint);
    },
    
    post(endpoint, data) {
      return this.fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    
    put(endpoint, data) {
      return this.fetch(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },
    
    delete(endpoint) {
      return this.fetch(endpoint, {
        method: 'DELETE'
      });
    }
  };
  
  /**
   * UI Utilities
   */
  function showNotification(type, message, duration = 5000) {
    // Create notification container if it doesn't exist
    let container = document.querySelector('.notification-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'notification-container';
      document.body.appendChild(container);
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <div class="notification-icon">
        <i class="fa fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
      </div>
      <div class="notification-content">
        <div class="notification-message">${message}</div>
      </div>
      <button class="notification-close">&times;</button>
    `;
    
    // Add to container
    container.appendChild(notification);
    
    // Setup close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
      notification.classList.add('fade-out');
      setTimeout(() => {
        container.removeChild(notification);
      }, 300);
    });
    
    // Auto-remove after duration
    setTimeout(() => {
      if (notification.parentNode) {
        notification.classList.add('fade-out');
        setTimeout(() => {
          if (notification.parentNode) {
            container.removeChild(notification);
          }
        }, 300);
      }
    }, duration);
  }
  
  function formatDate(dateString, includeTime = false) {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    
    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }
    
    return new Date(dateString).toLocaleDateString(AppState.language, options);
  }
  
  // Export utilities for other scripts
  window.Evruriro = {
    API,
    AppState,
    formatDate,
    showNotification,
    changeLanguage,
    toggleTheme
  };