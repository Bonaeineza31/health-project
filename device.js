// devices.js - Handles device connectivity for Evruriro health platform
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const scanButton = document.getElementById('scanDevices');
    const deviceList = document.getElementById('deviceList');
    const connectedDevices = document.getElementById('connectedDevices');
    
    // Mock device data (in a real application, these would come from API calls)
    const mockAvailableDevices = [
      { id: 'EVR-1234', name: 'Evruriro Watch Pro', type: 'watch', battery: 82, status: 'available' },
      { id: 'EVR-5678', name: 'Evruriro Bio Patch', type: 'patch', battery: 95, status: 'available' },
      { id: 'EVR-9012', name: 'Evruriro Vital Band', type: 'band', battery: 64, status: 'available' }
    ];
    
    const mockConnectedDevices = [
      { id: 'EVR-3456', name: 'Evruriro Pulse Monitor', type: 'monitor', battery: 45, status: 'connected', 
        patientId: 'PAT-7890', lastSync: '2025-03-24T08:30:00', vitals: {
          heartRate: 72,
          bloodPressure: '120/80',
          oxygenLevel: 98,
          temperature: 36.7
        }
      }
    ];
    
    // API endpoints (replace with your actual API endpoints)
    const API_URL = 'https://api.evruriro.com/v1';
    const ENDPOINTS = {
      scanDevices: `${API_URL}/devices/scan`,
      connect: `${API_URL}/devices/connect`,
      disconnect: `${API_URL}/devices/disconnect`,
      deviceData: `${API_URL}/devices/data`
    };
    
    // Initialize the page
    function init() {
      renderConnectedDevices();
      
      // Event listeners
      scanButton.addEventListener('click', handleScanDevices);
    }
    
    // Handle device scanning
    async function handleScanDevices() {
      // Show loading state
      scanButton.disabled = true;
      scanButton.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Scanning...';
      deviceList.innerHTML = '<p class="scanning-message">Scanning for nearby devices...</p>';
      
      try {
        // In a real app, you would call your API
        // const response = await fetch(ENDPOINTS.scanDevices);
        // const devices = await response.json();
        
        // Using mock data for demonstration
        await simulateApiCall(1500); // Simulate network delay
        const devices = mockAvailableDevices;
        
        renderAvailableDevices(devices);
      } catch (error) {
        deviceList.innerHTML = `<p class="error-message">Error scanning for devices: ${error.message}</p>`;
        console.error('Error scanning for devices:', error);
      } finally {
        // Reset button state
        scanButton.disabled = false;
        scanButton.innerHTML = '<i class="fa fa-search"></i> Scan for Devices';
      }
    }
    
    // Render available devices
    function renderAvailableDevices(devices) {
      if (devices.length === 0) {
        deviceList.innerHTML = '<p class="no-devices">No devices found. Make sure your device is powered on and in range.</p>';
        return;
      }
      
      deviceList.innerHTML = '';
      devices.forEach(device => {
        const deviceElement = document.createElement('div');
        deviceElement.className = 'device-item';
        deviceElement.innerHTML = `
          <div class="device-info">
            <h3>${device.name}</h3>
            <p class="device-id">ID: ${device.id}</p>
            <p class="device-type"><i class="fa fa-tag"></i> ${capitalizeFirstLetter(device.type)}</p>
            <p class="device-battery"><i class="fa fa-battery-${getBatteryIcon(device.battery)}"></i> ${device.battery}%</p>
          </div>
          <div class="device-actions">
            <button class="btn primary connect-btn" data-device-id="${device.id}">
              <i class="fa fa-link"></i> Connect
            </button>
          </div>
        `;
        
        deviceList.appendChild(deviceElement);
        
        // Add event listener to the connect button
        const connectBtn = deviceElement.querySelector('.connect-btn');
        connectBtn.addEventListener('click', () => handleConnectDevice(device));
      });
    }
    
    // Handle device connection
    async function handleConnectDevice(device) {
      try {
        // Update UI to show connecting state
        const connectBtn = document.querySelector(`.connect-btn[data-device-id="${device.id}"]`);
        const originalBtnText = connectBtn.innerHTML;
        connectBtn.disabled = true;
        connectBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Connecting...';
        
        // In a real app, you would call your API to connect the device
        // const response = await fetch(ENDPOINTS.connect, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ deviceId: device.id })
        // });
        // const result = await response.json();
        
        // Using mock data for demonstration
        await simulateApiCall(2000); // Simulate connection process
        
        // Update the connected devices list
        const connectedDevice = {
          ...device,
          status: 'connected',
          patientId: 'PAT-7890', // This would come from your user session or a selection
          lastSync: new Date().toISOString(),
          vitals: {
            heartRate: Math.floor(Math.random() * (90 - 60) + 60),
            bloodPressure: '120/80',
            oxygenLevel: Math.floor(Math.random() * (100 - 95) + 95),
            temperature: (Math.random() * (37.2 - 36.5) + 36.5).toFixed(1)
          }
        };
        
        mockConnectedDevices.push(connectedDevice);
        
        // Remove the device from available list and update UI
        const deviceIndex = mockAvailableDevices.findIndex(d => d.id === device.id);
        if (deviceIndex !== -1) {
          mockAvailableDevices.splice(deviceIndex, 1);
        }
        
        renderAvailableDevices(mockAvailableDevices);
        renderConnectedDevices();
        
        // Show success message
        showNotification('Device connected successfully!', 'success');
        
      } catch (error) {
        showNotification(`Error connecting device: ${error.message}`, 'error');
        console.error('Error connecting device:', error);
        
        // Reset button state
        const connectBtn = document.querySelector(`.connect-btn[data-device-id="${device.id}"]`);
        if (connectBtn) {
          connectBtn.disabled = false;
          connectBtn.innerHTML = '<i class="fa fa-link"></i> Connect';
        }
      }
    }
    
    // Render connected devices
    function renderConnectedDevices() {
      if (mockConnectedDevices.length === 0) {
        connectedDevices.innerHTML = '<p class="no-devices">No devices connected. Connect a device to start monitoring.</p>';
        return;
      }
      
      connectedDevices.innerHTML = '';
      mockConnectedDevices.forEach(device => {
        const deviceElement = document.createElement('div');
        deviceElement.className = 'connected-device-item';
        deviceElement.innerHTML = `
          <div class="device-info">
            <h3>${device.name}</h3>
            <p class="device-id">ID: ${device.id}</p>
            <p class="device-type"><i class="fa fa-tag"></i> ${capitalizeFirstLetter(device.type)}</p>
            <p class="device-patient"><i class="fa fa-user"></i> Patient ID: ${device.patientId}</p>
            <p class="device-battery"><i class="fa fa-battery-${getBatteryIcon(device.battery)}"></i> ${device.battery}%</p>
            <p class="device-sync"><i class="fa fa-refresh"></i> Last sync: ${formatDate(device.lastSync)}</p>
          </div>
          <div class="device-vitals">
            <h4>Current Vitals</h4>
            <div class="vitals-grid">
              <div class="vital-item">
                <i class="fa fa-heartbeat"></i>
                <span>${device.vitals.heartRate} BPM</span>
              </div>
              <div class="vital-item">
                <i class="fa fa-tint"></i>
                <span>${device.vitals.bloodPressure}</span>
              </div>
              <div class="vital-item">
                <i class="fa fa-lungs"></i>
                <span>${device.vitals.oxygenLevel}% O₂</span>
              </div>
              <div class="vital-item">
                <i class="fa fa-thermometer-half"></i>
                <span>${device.vitals.temperature}°C</span>
              </div>
            </div>
          </div>
          <div class="device-actions">
            <button class="btn secondary sync-btn" data-device-id="${device.id}">
              <i class="fa fa-refresh"></i> Sync Now
            </button>
            <button class="btn warning disconnect-btn" data-device-id="${device.id}">
              <i class="fa fa-unlink"></i> Disconnect
            </button>
          </div>
        `;
        
        connectedDevices.appendChild(deviceElement);
        
        // Add event listeners
        const syncBtn = deviceElement.querySelector('.sync-btn');
        syncBtn.addEventListener('click', () => handleSyncDevice(device));
        
        const disconnectBtn = deviceElement.querySelector('.disconnect-btn');
        disconnectBtn.addEventListener('click', () => handleDisconnectDevice(device));
      });
    }
    
    // Handle device sync
    async function handleSyncDevice(device) {
      try {
        // Update UI to show syncing state
        const syncBtn = document.querySelector(`.sync-btn[data-device-id="${device.id}"]`);
        syncBtn.disabled = true;
        syncBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Syncing...';
        
        // In a real app, you would call your API
        // const response = await fetch(`${ENDPOINTS.deviceData}/${device.id}/sync`, { method: 'POST' });
        // const result = await response.json();
        
        // Using mock data for demonstration
        await simulateApiCall(1500); // Simulate sync process
        
        // Update device data
        const deviceIndex = mockConnectedDevices.findIndex(d => d.id === device.id);
        if (deviceIndex !== -1) {
          mockConnectedDevices[deviceIndex] = {
            ...device,
            lastSync: new Date().toISOString(),
            vitals: {
              heartRate: Math.floor(Math.random() * (90 - 60) + 60),
              bloodPressure: '120/80',
              oxygenLevel: Math.floor(Math.random() * (100 - 95) + 95),
              temperature: (Math.random() * (37.2 - 36.5) + 36.5).toFixed(1)
            }
          };
        }
        
        renderConnectedDevices();
        showNotification('Device synced successfully!', 'success');
        
      } catch (error) {
        showNotification(`Error syncing device: ${error.message}`, 'error');
        console.error('Error syncing device:', error);
        
        // Reset button state
        const syncBtn = document.querySelector(`.sync-btn[data-device-id="${device.id}"]`);
        if (syncBtn) {
          syncBtn.disabled = false;
          syncBtn.innerHTML = '<i class="fa fa-refresh"></i> Sync Now';
        }
      }
    }
    
    // Handle device disconnection
    async function handleDisconnectDevice(device) {
      try {
        // Confirm disconnection
        if (!confirm(`Are you sure you want to disconnect ${device.name}?`)) {
          return;
        }
        
        // Update UI to show disconnecting state
        const disconnectBtn = document.querySelector(`.disconnect-btn[data-device-id="${device.id}"]`);
        disconnectBtn.disabled = true;
        disconnectBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Disconnecting...';
        
        // In a real app, you would call your API
        // const response = await fetch(ENDPOINTS.disconnect, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ deviceId: device.id })
        // });
        // const result = await response.json();
        
        // Using mock data for demonstration
        await simulateApiCall(1000); // Simulate disconnection process
        
        // Remove device from connected devices
        const deviceIndex = mockConnectedDevices.findIndex(d => d.id === device.id);
        if (deviceIndex !== -1) {
          mockConnectedDevices.splice(deviceIndex, 1);
        }
        
        // Add back to available devices
        const availableDevice = {
          id: device.id,
          name: device.name,
          type: device.type,
          battery: device.battery,
          status: 'available'
        };
        mockAvailableDevices.push(availableDevice);
        
        renderConnectedDevices();
        renderAvailableDevices(mockAvailableDevices);
        showNotification('Device disconnected successfully!', 'success');
        
      } catch (error) {
        showNotification(`Error disconnecting device: ${error.message}`, 'error');
        console.error('Error disconnecting device:', error);
        
        // Reset button state
        const disconnectBtn = document.querySelector(`.disconnect-btn[data-device-id="${device.id}"]`);
        if (disconnectBtn) {
          disconnectBtn.disabled = false;
          disconnectBtn.innerHTML = '<i class="fa fa-unlink"></i> Disconnect';
        }
      }
    }
    
    // Show notification
    function showNotification(message, type = 'info') {
      // Check if notification container exists, create if not
      let notificationContainer = document.querySelector('.notification-container');
      if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
      }
      
      // Create notification element
      const notification = document.createElement('div');
      notification.className = `notification ${type}`;
      notification.innerHTML = `
        <div class="notification-icon">
          <i class="fa fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        </div>
        <div class="notification-content">${message}</div>
        <button class="notification-close"><i class="fa fa-times"></i></button>
      `;
      
      // Add notification to container
      notificationContainer.appendChild(notification);
      
      // Add event listener to close button
      const closeButton = notification.querySelector('.notification-close');
      closeButton.addEventListener('click', () => {
        notification.classList.add('fade-out');
        setTimeout(() => {
          notification.remove();
        }, 300);
      });
      
      // Auto-remove after 5 seconds
      setTimeout(() => {
        if (notification.parentNode) {
          notification.classList.add('fade-out');
          setTimeout(() => {
            notification.remove();
          }, 300);
        }
      }, 5000);
    }
    
    // Helper function to capitalize first letter
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    // Helper function to get battery icon based on percentage
    function getBatteryIcon(percentage) {
      if (percentage >= 75) return 'full';
      if (percentage >= 50) return 'three-quarters';
      if (percentage >= 25) return 'half';
      if (percentage > 10) return 'quarter';
      return 'empty';
    }
    
    // Helper function to format date
    function formatDate(dateString) {
      const date = new Date(dateString);
      const now = new Date();
      
      // If today, show time only
      if (date.toDateString() === now.toDateString()) {
        return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }
      
      // Otherwise show date and time
      return date.toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    // Helper function to simulate API call delay
    function simulateApiCall(delay) {
      return new Promise(resolve => setTimeout(resolve, delay));
    }
    
    // Initialize the page
    init();
  });