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
    
    // Initialize devices
    initDevices();
});

function initDevices() {
    // DOM Elements
    const profileDropdown = document.getElementById('profileDropdown');
    const profileMenu = document.getElementById('profileMenu');
    const darkModeToggle = document.getElementById('darkModeToggle');

    // Connect Device Elements
    const connectionError = document.getElementById('connectionError');
    const errorMessage = document.getElementById('errorMessage');
    const scanSection = document.getElementById('scanSection');
    const monitorSection = document.getElementById('monitorSection');
    const scanButton = document.getElementById('scanButton');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const devicesList = document.getElementById('devicesList');
    const devicesContainer = document.getElementById('devicesContainer');
    const connectedDeviceName = document.getElementById('connectedDeviceName');
    const disconnectButton = document.getElementById('disconnectButton');
    const temperatureValue = document.getElementById('temperatureValue');
    const heartRateValue = document.getElementById('heartRateValue');
    const oxygenValue = document.getElementById('oxygenValue');
    const bpValue = document.getElementById('bpValue');
    const saveButton = document.getElementById('saveButton');

    // State variables
    let isScanning = false;
    let connectedDevice = null;
    let availableDevices = [];
    let vitalSignsInterval = null;

    // Sample device data
    const sampleDevices = [
        { id: 'EVR-WT100-1234', name: 'Evruriro Wearable Tracker', batteryLevel: 78 },
        { id: 'EVR-BP200-5678', name: 'Evruriro BP Monitor', batteryLevel: 92 },
        { id: 'EVR-OX300-9012', name: 'Evruriro Pulse Oximeter', batteryLevel: 65 }
    ];

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
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
        }

        // Save to localStorage
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
        
        // Dispatch theme change event for other components
        document.dispatchEvent(new CustomEvent('themeChange', {
            detail: { theme: isDark ? 'light' : 'dark' }
        }));
    }

    // Scan for devices
    if (scanButton) {
        scanButton.addEventListener('click', () => {
            if (isScanning) return;

            isScanning = true;
            connectionError.style.display = 'none';
            scanButton.textContent = 'Scanning...';
            scanButton.disabled = true;
            loadingIndicator.style.display = 'flex';
            devicesList.style.display = 'none';

            // Simulate finding devices after 3 seconds
            setTimeout(() => {
                isScanning = false;
                scanButton.textContent = 'Scan for Devices';
                scanButton.disabled = false;
                loadingIndicator.style.display = 'none';

                // Populate devices list
                availableDevices = [...sampleDevices];
                renderDevicesList();
                devicesList.style.display = 'block';
            }, 3000);
        });
    }

    // Render devices list
    function renderDevicesList() {
        devicesContainer.innerHTML = '';

        availableDevices.forEach(device => {
            const deviceElement = document.createElement('div');
            deviceElement.className = 'evr-connect-device-item';

            deviceElement.innerHTML = `
                <div class="evr-connect-device-item-info">
                    <div class="evr-connect-device-item-name">${device.name}</div>
                    <div class="evr-connect-device-item-id">${device.id}</div>
                </div>
                <div class="evr-connect-device-item-battery">
                    ${device.batteryLevel}%
                </div>
                <button class="evr-connect-device-item-button" data-device-id="${device.id}">
                    Connect
                </button>
            `;

            devicesContainer.appendChild(deviceElement);

            // Add event listener to connect button
            const connectButton = deviceElement.querySelector('.evr-connect-device-item-button');
            connectButton.addEventListener('click', () => {
                connectToDevice(device);
            });
        });
    }

    // Connect to device
    function connectToDevice(device) {
        isScanning = false;
        connectionError.style.display = 'none';
        loadingIndicator.style.display = 'flex';
        devicesList.style.display = 'none';
        scanButton.textContent = 'Connecting...';
        scanButton.disabled = true;

        // Simulate connection process (2 seconds)
        setTimeout(() => {
            loadingIndicator.style.display = 'none';

            // 10% chance of connection failure for realism
            if (Math.random() > 0.9) {
                connectionError.style.display = 'flex';
                errorMessage.textContent = `Failed to connect to ${device.name}. Please try again.`;
                scanButton.textContent = 'Scan for Devices';
                scanButton.disabled = false;
                connectedDevice = null;
            } else {
                // Connection successful
                connectedDevice = { ...device, status: 'connected' };
                connectedDeviceName.textContent = `Connected to ${device.name}`;

                // Switch to monitor section
                scanSection.style.display = 'none';
                monitorSection.style.display = 'flex';

                // Start updating vital signs
                startVitalSignsUpdates();
            }
        }, 2000);
    }

    // Disconnect from device
    if (disconnectButton) {
        disconnectButton.addEventListener('click', () => {
            // Stop vital signs updates
            if (vitalSignsInterval) {
                clearInterval(vitalSignsInterval);
                vitalSignsInterval = null;
            }

            // Reset vital signs
            temperatureValue.textContent = '--';
            heartRateValue.textContent = '--';
            oxygenValue.textContent = '--';
            bpValue.textContent = '--';

            // Reset device connection
            connectedDevice = null;

            // Switch back to scan section
            monitorSection.style.display = 'none';
            scanSection.style.display = 'flex';
            scanButton.textContent = 'Scan for Devices';
            scanButton.disabled = false;
        });
    }

    // Start vital signs updates
    function startVitalSignsUpdates() {
        // Update immediately
        updateVitalSigns();

        // Then update every 5 seconds
        vitalSignsInterval = setInterval(updateVitalSigns, 5000);
    }

    // Update vital signs
    function updateVitalSigns() {
        const temperature = (Math.random() * (37.8 - 36.5) + 36.5).toFixed(1);
        const heartRate = Math.floor(Math.random() * (95 - 65) + 65);
        const oxygenLevel = Math.floor(Math.random() * (100 - 95) + 95);
        const systolic = Math.floor(Math.random() * (140 - 110) + 110);
        const diastolic = Math.floor(Math.random() * (90 - 70) + 70);

        temperatureValue.textContent = `${temperature}°C`;
        heartRateValue.textContent = `${heartRate} BPM`;
        oxygenValue.textContent = `${oxygenLevel}%`;
        bpValue.textContent = `${systolic}/${diastolic}`;
    }

    // Save vital signs to patient record
    if (saveButton) {
        saveButton.addEventListener('click', () => {
            // Simulate saving vital signs to patient record
            alert('Vital signs saved to patient record successfully!');
        });
    }

    // Listen for theme change events from sidebar
    document.addEventListener('themeChange', (e) => {
        document.documentElement.setAttribute('data-theme', e.detail.theme);
    });

    // Initialize theme
    document.addEventListener('DOMContentLoaded', () => {
        // Load theme preference
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
    });
}