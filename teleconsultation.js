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
  
  // Initialize teleconsultation
  initTeleconsultation();
});

function initTeleconsultation() {
  // DOM Elements - Navigation
  const profileDropdown = document.getElementById('profileDropdown');
  const profileMenu = document.getElementById('profileMenu');
  const darkModeToggle = document.getElementById('darkModeToggle');

  // DOM Elements - Tabs
  const appointmentDetailsTab = document.getElementById('appointmentDetailsTab');
  const vitalsTab = document.getElementById('vitalsTab');
  const symptomsTab = document.getElementById('symptomsTab');
  const historyTab = document.getElementById('historyTab');

  const appointmentDetailsContent = document.getElementById('appointmentDetailsContent');
  const vitalsContent = document.getElementById('vitalsContent');
  const symptomsContent = document.getElementById('symptomsContent');
  const historyContent = document.getElementById('historyContent');

  // DOM Elements - Consultation
  const joinConsultationBtn = document.getElementById('joinConsultationBtn');
  const toggleChatBtn = document.getElementById('toggleChatBtn');
  const videoCallContainer = document.getElementById('videoCallContainer');
  const chatPanel = document.getElementById('chatPanel');
  const closeChatBtn = document.getElementById('closeChatBtn');

  // DOM Elements - Video Call
  const doctorVideo = document.getElementById('doctorVideo');
  const selfVideo = document.getElementById('selfVideo');
  const micToggleBtn = document.getElementById('micToggleBtn');
  const videoToggleBtn = document.getElementById('videoToggleBtn');
  const screenShareBtn = document.getElementById('screenShareBtn');
  const endCallBtn = document.getElementById('endCallBtn');

  // DOM Elements - Chat
  const chatMessages = document.getElementById('chatMessages');
  const newMessageInput = document.getElementById('newMessageInput');
  const sendMessageBtn = document.getElementById('sendMessageBtn');

  // DOM Elements - Vitals
  const uploadVitalsBtn = document.getElementById('uploadVitalsBtn');
  const vitalsModal = document.getElementById('vitalsModal');
  const heartRateInput = document.getElementById('heartRateInput');
  const bloodPressureInput = document.getElementById('bloodPressureInput');
  const temperatureInput = document.getElementById('temperatureInput');
  const oxygenInput = document.getElementById('oxygenInput');
  const cancelVitalsBtn = document.getElementById('cancelVitalsBtn');
  const saveVitalsBtn = document.getElementById('saveVitalsBtn');

  // DOM Elements - Symptoms
  const symptomTags = document.getElementById('symptomTags');
  const addSymptomBtn = document.getElementById('addSymptomBtn');
  const addSymptomForm = document.getElementById('addSymptomForm');
  const newSymptom = document.getElementById('newSymptom');
  const symptomSeverity = document.getElementById('symptomSeverity');
  const saveSymptomBtn = document.getElementById('saveSymptomBtn');
  const cancelSymptomBtn = document.getElementById('cancelSymptomBtn');
  const saveNotesBtn = document.getElementById('saveNotesBtn');
  const doctorNotes = document.getElementById('doctorNotes');

  // DOM Elements - Checklist
  const prepChecklist = document.getElementById('prepChecklist');

  // State variables
  let isCallActive = false;
  let isMicOn = true;
  let isVideoOn = true;
  let isScreenSharing = false;
  let showChat = false;
  let localStream = null;
  let callStatus = 'ready';

  // Vitals data
  let patientVitals = {
      heartRate: '78 bpm',
      bloodPressure: '120/80 mmHg',
      temperature: '98.6°F',
      oxygenLevel: '98%'
  };

  // Symptoms data
  let symptoms = [
      { name: 'Headache', severity: 'Moderate' },
      { name: 'Sore throat', severity: 'Mild' },
      { name: 'Fatigue', severity: 'Severe' }
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

  // Tab switching
  if (appointmentDetailsTab) {
      appointmentDetailsTab.addEventListener('click', () => switchTab('appointmentDetails'));
  }
  if (vitalsTab) {
      vitalsTab.addEventListener('click', () => switchTab('vitals'));
  }
  if (symptomsTab) {
      symptomsTab.addEventListener('click', () => switchTab('symptoms'));
  }
  if (historyTab) {
      historyTab.addEventListener('click', () => switchTab('history'));
  }

  function switchTab(tabName) {
      // Hide all tab contents
      appointmentDetailsContent.style.display = 'none';
      vitalsContent.style.display = 'none';
      symptomsContent.style.display = 'none';
      historyContent.style.display = 'none';

      // Remove active class from all tabs
      appointmentDetailsTab.classList.remove('active');
      vitalsTab.classList.remove('active');
      symptomsTab.classList.remove('active');
      historyTab.classList.remove('active');

      // Show selected tab content and add active class
      if (tabName === 'appointmentDetails') {
          appointmentDetailsContent.style.display = 'block';
          appointmentDetailsTab.classList.add('active');
      } else if (tabName === 'vitals') {
          vitalsContent.style.display = 'block';
          vitalsTab.classList.add('active');
      } else if (tabName === 'symptoms') {
          symptomsContent.style.display = 'block';
          symptomsTab.classList.add('active');
      } else if (tabName === 'history') {
          historyContent.style.display = 'block';
          historyTab.classList.add('active');
      }
  }

  // Join consultation button
  if (joinConsultationBtn) {
      joinConsultationBtn.addEventListener('click', async () => {
          if (callStatus === 'ready') {
              callStatus = 'connecting';
              joinConsultationBtn.textContent = 'Connecting...';
              joinConsultationBtn.classList.remove('telecon-btn-join');
              joinConsultationBtn.classList.add('telecon-btn-connecting');
              joinConsultationBtn.disabled = true;

              try {
                  // Request camera and microphone access
                  localStream = await navigator.mediaDevices.getUserMedia({
                      video: true,
                      audio: true
                  });

                  // Display local video
                  const videoElement = document.createElement('video');
                  videoElement.srcObject = localStream;
                  videoElement.autoplay = true;
                  videoElement.muted = true; // Mute local video to prevent feedback
                  videoElement.style.width = '100%';
                  videoElement.style.height = '100%';
                  videoElement.style.objectFit = 'cover';

                  // Replace placeholder with video
                  selfVideo.innerHTML = '';
                  selfVideo.appendChild(videoElement);

                  // Show video call container
                  videoCallContainer.style.display = 'flex';

                  // Update call status
                  callStatus = 'ongoing';

                  // Update join button to end call button
                  joinConsultationBtn.textContent = 'End Call';
                  joinConsultationBtn.classList.remove('telecon-btn-connecting');
                  joinConsultationBtn.classList.add('telecon-btn-end-call');
                  joinConsultationBtn.disabled = false;

                  // Simulate doctor joining after a delay
                  setTimeout(() => {
                      // Create a placeholder video for the doctor
                      const doctorVideoElement = document.createElement('div');
                      doctorVideoElement.className = 'telecon-video-placeholder doctor';
                      doctorVideoElement.innerHTML = `
                          <img src="https://randomuser.me/api/portraits/women/44.jpg"
                              alt="Dr. Sarah Johnson"
                              style="width: 100%; height: 100%; object-fit: cover;"
                              onerror="this.src='/placeholder.svg?height=300&width=400'">
                      `;

                      // Replace placeholder with doctor's video
                      doctorVideo.innerHTML = '';
                      doctorVideo.appendChild(doctorVideoElement);
                  }, 3000);

              } catch (error) {
                  console.error('Error accessing media devices:', error);
                  alert('Failed to access camera and microphone. Please check permissions.');

                  // Reset button
                  callStatus = 'ready';
                  joinConsultationBtn.textContent = 'Join Consultation';
                  joinConsultationBtn.classList.remove('telecon-btn-connecting');
                  joinConsultationBtn.classList.add('telecon-btn-join');
                  joinConsultationBtn.disabled = false;
              }
          } else if (callStatus === 'ongoing') {
              // End the call
              endCall();
          }
      });
  }

  // End call function
  function endCall() {
      // Stop all tracks in the local stream
      if (localStream) {
          localStream.getTracks().forEach(track => track.stop());
      }

      // Hide video call container
      videoCallContainer.style.display = 'none';

      // Reset video placeholders
      selfVideo.innerHTML = '<span>Your Video</span>';
      doctorVideo.innerHTML = '<span>Doctor\'s Video</span>';

      // Reset call status
      callStatus = 'ready';

      // Reset join button
      joinConsultationBtn.textContent = 'Join Consultation';
      joinConsultationBtn.classList.remove('telecon-btn-end-call');
      joinConsultationBtn.classList.add('telecon-btn-join');
  }

  // End call button
  if (endCallBtn) {
      endCallBtn.addEventListener('click', endCall);
  }

  // Toggle microphone
  if (micToggleBtn) {
      micToggleBtn.addEventListener('click', () => {
          if (localStream) {
              const audioTracks = localStream.getAudioTracks();
              if (audioTracks.length > 0) {
                  const audioTrack = audioTracks[0];
                  audioTrack.enabled = !audioTrack.enabled;
                  isMicOn = audioTrack.enabled;

                  // Update button icon
                  micToggleBtn.innerHTML = isMicOn ?
                      '<i class="fa fa-microphone"></i>' :
                      '<i class="fa fa-microphone-slash"></i>';

                  // Update button class
                  if (isMicOn) {
                      micToggleBtn.classList.remove('inactive');
                      micToggleBtn.classList.add('active');
                  } else {
                      micToggleBtn.classList.remove('active');
                      micToggleBtn.classList.add('inactive');
                  }
              }
          }
      });
  }

  // Toggle video
  if (videoToggleBtn) {
      videoToggleBtn.addEventListener('click', () => {
          if (localStream) {
              const videoTracks = localStream.getVideoTracks();
              if (videoTracks.length > 0) {
                  const videoTrack = videoTracks[0];
                  videoTrack.enabled = !videoTrack.enabled;
                  isVideoOn = videoTrack.enabled;

                  // Update button icon
                  videoToggleBtn.innerHTML = isVideoOn ?
                      '<i class="fa fa-video-camera"></i>' :
                      '<i class="fa fa-video-camera-slash"></i>';

                  // Update button class
                  if (isVideoOn) {
                      videoToggleBtn.classList.remove('inactive');
                      videoToggleBtn.classList.add('active');
                  } else {
                      videoToggleBtn.classList.remove('active');
                      videoToggleBtn.classList.add('inactive');
                  }
              }
          }
      });
  }

  // Toggle screen sharing
  if (screenShareBtn) {
      screenShareBtn.addEventListener('click', () => {
          isScreenSharing = !isScreenSharing;

          // Update button icon
          screenShareBtn.innerHTML = isScreenSharing ?
              '<i class="fa fa-stop-circle"></i>' :
              '<i class="fa fa-desktop"></i>';

          // Update button class
          if (isScreenSharing) {
              screenShareBtn.classList.add('active');
              alert('Screen sharing started');
          } else {
              screenShareBtn.classList.remove('active');
              alert('Screen sharing stopped');
          }
      });
  }

  // Toggle chat panel
  if (toggleChatBtn) {
      toggleChatBtn.addEventListener('click', () => {
          showChat = !showChat;
          chatPanel.style.display = showChat ? 'flex' : 'none';

          // Update button text
          toggleChatBtn.textContent = showChat ? 'Hide Chat' : 'Open Chat';

          // Update button class
          if (showChat) {
              toggleChatBtn.classList.add('active');
          } else {
              toggleChatBtn.classList.remove('active');
          }
      });
  }

  // Close chat button
  if (closeChatBtn) {
      closeChatBtn.addEventListener('click', () => {
          showChat = false;
          chatPanel.style.display = 'none';
          toggleChatBtn.textContent = 'Open Chat';
          toggleChatBtn.classList.remove('active');
      });
  }

  // Send message
  if (sendMessageBtn) {
      sendMessageBtn.addEventListener('click', sendMessage);
  }
  
  if (newMessageInput) {
      newMessageInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
          }
      });
  }

  function sendMessage() {
      const messageText = newMessageInput.value.trim();
      if (messageText) {
          // Get current time
          const now = new Date();
          const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          // Add message to chat
          const messageHTML = `
              <div class="telecon-message outgoing">
                  <div class="telecon-message-content">
                      <div class="telecon-message-header">
                          <span class="telecon-message-sender">You</span>
                          <span class="telecon-message-time">${timeString}</span>
                      </div>
                      <p class="telecon-message-text">${messageText}</p>
                  </div>
              </div>
          `;
          chatMessages.insertAdjacentHTML('beforeend', messageHTML);

          // Clear input
          newMessageInput.value = '';

          // Scroll to bottom
          chatMessages.scrollTop = chatMessages.scrollHeight;

          // Simulate doctor's response after a delay
          setTimeout(() => {
              const responses = [
                  "Thank you for sharing those details. Have you tried any home remedies for your symptoms?",
                  "I see. When did these symptoms first appear?",
                  "I understand your concern. Let's discuss this further during our video consultation.",
                  "Have you checked your temperature recently?"
              ];
              const randomResponse = responses[Math.floor(Math.random() * responses.length)];
              const responseTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              const responseHTML = `
                  <div class="telecon-message incoming">
                      <div class="telecon-message-content">
                          <div class="telecon-message-header">
                              <span class="telecon-message-sender">Dr. Sarah Johnson</span>
                              <span class="telecon-message-time">${responseTime}</span>
                          </div>
                          <p class="telecon-message-text">${randomResponse}</p>
                      </div>
                  </div>
              `;
              chatMessages.insertAdjacentHTML('beforeend', responseHTML);

              // Scroll to bottom
              chatMessages.scrollTop = chatMessages.scrollHeight;
          }, 2000);
      }
  }

  // Upload vitals
  if (uploadVitalsBtn) {
      uploadVitalsBtn.addEventListener('click', () => {
          // Pre-fill form with current values
          heartRateInput.value = patientVitals.heartRate.replace(' bpm', '');
          bloodPressureInput.value = patientVitals.bloodPressure.replace(' mmHg', '');
          temperatureInput.value = patientVitals.temperature.replace('°F', '');
          oxygenInput.value = patientVitals.oxygenLevel.replace('%', '');

          // Show modal
          vitalsModal.style.display = 'flex';
      });
  }

  // Cancel vitals update
  if (cancelVitalsBtn) {
      cancelVitalsBtn.addEventListener('click', () => {
          vitalsModal.style.display = 'none';
      });
  }

  // Save vitals update
  if (saveVitalsBtn) {
      saveVitalsBtn.addEventListener('click', () => {
          // Update vitals data
          patientVitals.heartRate = `${heartRateInput.value} bpm`;
          patientVitals.bloodPressure = `${bloodPressureInput.value} mmHg`;
          patientVitals.temperature = `${temperatureInput.value}°F`;
          patientVitals.oxygenLevel = `${oxygenInput.value}%`;

          // Update display
          document.getElementById('heartRateValue').textContent = patientVitals.heartRate;
          document.getElementById('bloodPressureValue').textContent = patientVitals.bloodPressure;
          document.getElementById('temperatureValue').textContent = patientVitals.temperature;
          document.getElementById('oxygenValue').textContent = patientVitals.oxygenLevel;

          // Hide modal
          vitalsModal.style.display = 'none';
      });
  }

  // Add symptom
  if (addSymptomBtn) {
      addSymptomBtn.addEventListener('click', () => {
          addSymptomForm.style.display = 'block';
          addSymptomBtn.style.display = 'none';
      });
  }

  // Cancel add symptom
  if (cancelSymptomBtn) {
      cancelSymptomBtn.addEventListener('click', () => {
          addSymptomForm.style.display = 'none';
          addSymptomBtn.style.display = 'inline-block';
          newSymptom.value = '';
      });
  }

  // Save symptom
  if (saveSymptomBtn) {
      saveSymptomBtn.addEventListener('click', () => {
          const symptomName = newSymptom.value.trim();
          const severity = symptomSeverity.value;

          if (symptomName) {
              // Add to symptoms array
              symptoms.push({ name: symptomName, severity: severity });

              // Add to UI
              const newTag = document.createElement('span');
              newTag.className = 'telecon-symptom-tag';
              newTag.innerHTML = `
                  ${symptomName} (${severity})
                  <button class="telecon-remove-tag" data-index="${symptoms.length - 1}">×</button>
              `;
              symptomTags.insertBefore(newTag, addSymptomBtn);

              // Reset form
              newSymptom.value = '';
              addSymptomForm.style.display = 'none';
              addSymptomBtn.style.display = 'inline-block';

              // Update timeline
              updateSymptomTimeline();
          }
      });
  }

  // Remove symptom
  if (symptomTags) {
      symptomTags.addEventListener('click', (e) => {
          if (e.target.classList.contains('telecon-remove-tag')) {
              const index = parseInt(e.target.getAttribute('data-index'));

              // Remove from array
              symptoms.splice(index, 1);

              // Update UI
              e.target.parentElement.remove();

              // Update data-index attributes
              const removeButtons = document.querySelectorAll('.telecon-remove-tag');
              removeButtons.forEach((button, i) => {
                  button.setAttribute('data-index', i);
              });

              // Update timeline
              updateSymptomTimeline();
          }
      });
  }

  // Update symptom timeline
  function updateSymptomTimeline() {
      // In a real app, this would update the timeline data
      console.log('Updating symptom timeline with:', symptoms);
  }

  // Save doctor notes
  if (saveNotesBtn) {
      saveNotesBtn.addEventListener('click', () => {
          alert('Notes saved successfully!');
      });
  }

  // Checklist items
  if (prepChecklist) {
      prepChecklist.addEventListener('click', (e) => {
          if (e.target.tagName === 'LI') {
              e.target.classList.toggle('checked');
          }
      });
  }

  // Listen for theme change events from sidebar
  document.addEventListener('themeChange', (e) => {
      document.documentElement.setAttribute('data-theme', e.detail.theme);
  });

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
      // Load theme preference
      const savedTheme = localStorage.getItem('theme') || 'light';
      document.documentElement.setAttribute('data-theme', savedTheme);
  });
}