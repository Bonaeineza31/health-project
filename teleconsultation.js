// teleconsultation.js - Handles all functionality for the teleconsultation page

document.addEventListener('DOMContentLoaded', function() {
    // Mock data for upcoming consultations
    const upcomingConsultations = [
      {
        id: 1,
        doctorName: 'Dr. Sarah Johnson',
        specialty: 'Cardiology',
        date: '2025-03-25',
        time: '10:00',
        type: 'in-person'
      },
      {
        id: 2,
        doctorName: 'Dr. Michael Chen',
        specialty: 'Dermatology',
        date: '2025-04-05',
        time: '14:30',
        type: 'teleconsultation'
      }
    ];
  
    // Mock data for past consultations
    const pastConsultations = [
      {
        id: 101,
        doctorName: 'Dr. Smith',
        specialty: 'General',
        date: '2025-03-21',
        time: '09:00',
        type: 'teleconsultation',
        notes: 'Follow-up on medication. Blood pressure improving.'
      },
      {
        id: 102,
        doctorName: 'Dr. Emily Rodriguez',
        specialty: 'Dermatology',
        date: '2025-03-15',
        time: '16:00',
        type: 'teleconsultation',
        notes: 'Skin condition improving. Continue current treatment.'
      },
      {
        id: 103,
        doctorName: 'Dr. James Wilson',
        specialty: 'Internal Medicine',
        date: '2025-02-28',
        time: '11:30',
        type: 'in-person',
        notes: 'Annual checkup completed. All vitals normal.'
      }
    ];
  
    // DOM elements
    const upcomingConsultationsContainer = document.getElementById('upcomingConsultations');
    const pastConsultationsContainer = document.getElementById('pastConsultations');
    const startEmergencyBtn = document.getElementById('startEmergencyConsultation');
    const scheduleConsultationBtn = document.getElementById('scheduleConsultation');
    const teleconModal = document.getElementById('teleconModal');
    const specialtyButtons = document.querySelectorAll('.specialty-item');
    const sendMessageBtn = document.getElementById('sendMessage');
    const messageInput = document.getElementById('messageInput');
    const chatMessages = document.getElementById('chatMessages');
    const callTimer = document.getElementById('callTimer');
    const doctorNameElement = document.getElementById('doctorName');
  
    // Variables
    let selectedSpecialty = 'general';
    let timerInterval = null;
    let secondsElapsed = 0;
  
    // Initialize the page
    function init() {
      renderUpcomingConsultations();
      renderPastConsultations();
      setupEventListeners();
    }
  
    // Render upcoming consultations
    function renderUpcomingConsultations() {
      if (!upcomingConsultationsContainer) return;
      
      upcomingConsultationsContainer.innerHTML = '';
      
      if (upcomingConsultations.length === 0) {
        upcomingConsultationsContainer.innerHTML = '<p class="no-data">No upcoming consultations scheduled</p>';
        return;
      }
  
      upcomingConsultations.forEach(consultation => {
        const consultationElement = document.createElement('div');
        consultationElement.className = 'consultation-card';
        
        const date = new Date(consultation.date);
        const formattedDate = date.toLocaleDateString('en-US', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric' 
        });
  
        consultationElement.innerHTML = `
          <div class="consultation-info">
            <h3>${consultation.doctorName}</h3>
            <p class="specialty">${consultation.specialty}</p>
            <p class="datetime">
              <i class="fa fa-calendar"></i> ${formattedDate} at ${consultation.time}
            </p>
            <span class="consultation-type ${consultation.type}">${consultation.type}</span>
          </div>
          <div class="consultation-actions">
            <button class="btn secondary reschedule-btn" data-id="${consultation.id}">Reschedule</button>
            ${consultation.type === 'teleconsultation' ? 
              `<button class="btn primary join-btn" data-id="${consultation.id}" data-doctor="${consultation.doctorName}">Join Now</button>` : 
              `<button class="btn primary">Get Directions</button>`
            }
          </div>
        `;
        
        upcomingConsultationsContainer.appendChild(consultationElement);
      });
  
      // Add event listeners to the join buttons
      document.querySelectorAll('.join-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const consultationId = e.target.getAttribute('data-id');
          const doctorName = e.target.getAttribute('data-doctor');
          openTeleconModal(doctorName);
        });
      });
  
      // Add event listeners to the reschedule buttons
      document.querySelectorAll('.reschedule-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const consultationId = e.target.getAttribute('data-id');
          // Redirect to appointment scheduling page with the consultation ID
          window.location.href = `appointment.html?reschedule=${consultationId}`;
        });
      });
    }
  
    // Render past consultations
    function renderPastConsultations() {
      if (!pastConsultationsContainer) return;
      
      pastConsultationsContainer.innerHTML = '';
      
      if (pastConsultations.length === 0) {
        pastConsultationsContainer.innerHTML = '<p class="no-data">No consultation history available</p>';
        return;
      }
  
      pastConsultations.forEach(consultation => {
        const consultationElement = document.createElement('div');
        consultationElement.className = 'history-card';
        
        const date = new Date(consultation.date);
        const formattedDate = date.toLocaleDateString('en-US', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric' 
        });
  
        consultationElement.innerHTML = `
          <div class="history-header">
            <div>
              <h3>${consultation.doctorName}</h3>
              <p class="specialty">${consultation.specialty}</p>
              <p class="datetime">
                <i class="fa fa-calendar"></i> ${formattedDate} at ${consultation.time}
              </p>
              <span class="consultation-type ${consultation.type}">${consultation.type}</span>
            </div>
            <div class="history-actions">
              <button class="btn secondary view-summary-btn" data-id="${consultation.id}">
                <i class="fa fa-file-text-o"></i> View Summary
              </button>
              ${consultation.type === 'teleconsultation' ? 
                `<button class="btn secondary view-recording-btn" data-id="${consultation.id}">
                  <i class="fa fa-video-camera"></i> View Recording
                </button>` : ''
              }
            </div>
          </div>
          <div class="history-notes">
            <p><strong>Notes:</strong> ${consultation.notes}</p>
          </div>
        `;
        
        pastConsultationsContainer.appendChild(consultationElement);
      });
  
      // Add event listeners to the view summary buttons
      document.querySelectorAll('.view-summary-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const consultationId = e.target.getAttribute('data-id');
          // Open consultation summary (can be implemented to show a modal or navigate to a new page)
          alert(`Viewing summary for consultation ${consultationId}`);
        });
      });
  
      // Add event listeners to the view recording buttons
      document.querySelectorAll('.view-recording-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const consultationId = e.target.getAttribute('data-id');
          // Open consultation recording (can be implemented to show a modal with video player)
          alert(`Viewing recording for consultation ${consultationId}`);
        });
      });
    }
  
    // Set up event listeners for the page
    function setupEventListeners() {
      // Specialty selection
      specialtyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          // Remove active class from all buttons
          specialtyButtons.forEach(btn => btn.classList.remove('active'));
          
          // Add active class to clicked button
          e.currentTarget.classList.add('active');
          
          // Update selected specialty
          selectedSpecialty = e.currentTarget.getAttribute('data-specialty');
        });
      });
  
      // Start emergency consultation
      if (startEmergencyBtn) {
        startEmergencyBtn.addEventListener('click', () => {
          // In a real application, this would check doctor availability
          // For demo purposes, show a loading state and then open the modal
          startEmergencyBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Connecting...';
          startEmergencyBtn.disabled = true;
          
          setTimeout(() => {
            startEmergencyBtn.innerHTML = '<i class="fa fa-phone"></i> Start Emergency Consultation';
            startEmergencyBtn.disabled = false;
            
            // Get doctor name based on selected specialty
            let doctorName = 'Dr. Smith';
            switch (selectedSpecialty) {
              case 'cardiology':
                doctorName = 'Dr. Sarah Johnson';
                break;
              case 'dermatology':
                doctorName = 'Dr. Emily Rodriguez';
                break;
              case 'pediatrics':
                doctorName = 'Dr. Michael Chen';
                break;
              default:
                doctorName = 'Dr. Smith';
            }
            
            openTeleconModal(doctorName);
          }, 2000);
        });
      }
  
      // Schedule consultation
      if (scheduleConsultationBtn) {
        scheduleConsultationBtn.addEventListener('click', () => {
          // Redirect to appointment scheduling page with the selected specialty
          window.location.href = `appointment.html?specialty=${selectedSpecialty}`;
        });
      }
  
      // Telecon modal controls
      if (teleconModal) {
        // Close modal when clicking the end call button
        document.querySelector('.end-btn').addEventListener('click', () => {
          closeTeleconModal();
        });
  
        // Toggle mute
        document.querySelector('.mute-btn').addEventListener('click', (e) => {
          e.currentTarget.classList.toggle('active');
          const icon = e.currentTarget.querySelector('i');
          if (e.currentTarget.classList.contains('active')) {
            icon.className = 'fa fa-microphone';
          } else {
            icon.className = 'fa fa-microphone-slash';
          }
        });
  
        // Toggle video
        document.querySelector('.video-btn').addEventListener('click', (e) => {
          e.currentTarget.classList.toggle('active');
          const icon = e.currentTarget.querySelector('i');
          if (e.currentTarget.classList.contains('active')) {
            icon.className = 'fa fa-video-camera-slash';
            document.querySelector('.self-video .video-placeholder').style.display = 'flex';
          } else {
            icon.className = 'fa fa-video-camera';
            document.querySelector('.self-video .video-placeholder').style.display = 'none';
          }
        });
      }
  
      // Chat functionality
      if (sendMessageBtn && messageInput && chatMessages) {
        sendMessageBtn.addEventListener('click', sendMessage);
        messageInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            sendMessage();
          }
        });
      }
    }
  
    // Open teleconsultation modal
    function openTeleconModal(doctorName) {
      if (!teleconModal) return;
      
      // Set doctor name
      if (doctorNameElement) {
        doctorNameElement.textContent = doctorName;
      }
      
      // Reset chat
      if (chatMessages) {
        chatMessages.innerHTML = '';
        
        // Add system message
        addChatMessage('system', 'Connecting to consultation room...');
        
        setTimeout(() => {
          addChatMessage('system', `You're connected with ${doctorName}`);
          
          setTimeout(() => {
            addChatMessage('doctor', 'Hello! How can I help you today?');
          }, 1000);
        }, 1500);
      }
      
      // Show modal
      teleconModal.style.display = 'flex';
      
      // Start timer
      startTimer();
      
      // Simulate doctor connection after a delay
      setTimeout(() => {
        document.querySelector('.main-video .video-placeholder').innerHTML = `
          <i class="fa fa-user-md"></i>
          <span>${doctorName} is connected</span>
        `;
      }, 3000);
    }
  
    // Close teleconsultation modal
    function closeTeleconModal() {
      if (!teleconModal) return;
      
      // Hide modal
      teleconModal.style.display = 'none';
      
      // Stop timer
      stopTimer();
      
      // Reset UI elements
      document.querySelector('.main-video .video-placeholder').innerHTML = `
        <i class="fa fa-user-md"></i>
        <span>Doctor's camera is connecting...</span>
      `;
      
      document.querySelector('.mute-btn').classList.remove('active');
      document.querySelector('.mute-btn i').className = 'fa fa-microphone-slash';
      
      document.querySelector('.video-btn').classList.remove('active');
      document.querySelector('.video-btn i').className = 'fa fa-video-camera';
    }
  
    // Send chat message
    function sendMessage() {
      if (!messageInput || !chatMessages) return;
      
      const message = messageInput.value.trim();
      if (message === '') return;
      
      // Add user message
      addChatMessage('user', message);
      
      // Clear input
      messageInput.value = '';
      
      // Simulate doctor response after a delay
      setTimeout(() => {
        // For demo purposes, generate a simple response
        let response;
        if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
          response = 'Hello! How are you feeling today?';
        } else if (message.toLowerCase().includes('pain') || message.toLowerCase().includes('hurt')) {
          response = 'I\'m sorry to hear that. Can you describe the pain level on a scale of 1-10?';
        } else if (message.toLowerCase().includes('prescription') || message.toLowerCase().includes('medicine')) {
          response = 'I can send an updated prescription to your pharmacy. Which one do you prefer?';
        } else if (message.toLowerCase().includes('thank')) {
          response = 'You\'re welcome! Is there anything else I can help you with today?';
        } else {
          response = 'I understand. Could you tell me more about your symptoms?';
        }
        
        addChatMessage('doctor', response);
      }, 1000);
    }
  
    // Add message to chat
    function addChatMessage(type, content) {
      if (!chatMessages) return;
      
      const messageElement = document.createElement('div');
      messageElement.className = `chat-message ${type}-message`;
      
      let messageHTML;
      if (type === 'user') {
        messageHTML = `
          <div class="message-content">
            <p>${content}</p>
            <span class="message-time">${getCurrentTime()}</span>
          </div>
          <div class="message-avatar">
            <i class="fa fa-user"></i>
          </div>
        `;
      } else if (type === 'doctor') {
        messageHTML = `
          <div class="message-avatar">
            <i class="fa fa-user-md"></i>
          </div>
          <div class="message-content">
            <p>${content}</p>
            <span class="message-time">${getCurrentTime()}</span>
          </div>
        `;
      } else if (type === 'system') {
        messageHTML = `
          <div class="system-message">
            <p>${content}</p>
            <span class="message-time">${getCurrentTime()}</span>
          </div>
        `;
      }
      
      messageElement.innerHTML = messageHTML;
      chatMessages.appendChild(messageElement);
      
      // Scroll to bottom
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  
    // Start call timer
    function startTimer() {
      if (!callTimer) return;
      
      // Reset
      secondsElapsed = 0;
      clearInterval(timerInterval);
      
      // Update timer every second
      timerInterval = setInterval(() => {
        secondsElapsed++;
        
        const minutes = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
        const seconds = (secondsElapsed % 60).toString().padStart(2, '0');
        
        callTimer.textContent = `${minutes}:${seconds}`;
      }, 1000);
    }
  
    // Stop call timer
    function stopTimer() {
      clearInterval(timerInterval);
      if (callTimer) {
        callTimer.textContent = '00:00';
      }
    }
  
    // Get current time for chat messages
    function getCurrentTime() {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      
      hours = hours % 12;
      hours = hours ? hours : 12; // Convert 0 to 12
      
      return `${hours}:${minutes} ${ampm}`;
    }
  
    // Initialize the page
    init();
  });