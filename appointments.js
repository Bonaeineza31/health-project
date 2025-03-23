/**
 * Evruriro Healthcare Platform
 * appointments.js - Functionality for the appointment scheduling page
 */

// Mock data for doctors (in a real app, this would come from an API)
const DOCTORS = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "cardiology",
      image: "images/doctors/doctor1.jpg",
      rating: 4.8,
      appointmentTypes: ["in-person", "virtual"],
      bio: "Board certified cardiologist with 15 years of experience specializing in preventive cardiology and heart disease management."
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "dermatology",
      image: "images/doctors/doctor2.jpg",
      rating: 4.7,
      appointmentTypes: ["in-person"],
      bio: "Specializing in clinical dermatology and skin cancer prevention with a focus on minimally invasive procedures."
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialty: "internal",
      image: "images/doctors/doctor3.jpg",
      rating: 4.9,
      appointmentTypes: ["in-person", "virtual"],
      bio: "Internal medicine physician focused on comprehensive adult care, chronic disease management, and preventative health."
    },
    {
      id: 4,
      name: "Dr. David Wilson",
      specialty: "neurology",
      image: "images/doctors/doctor4.jpg",
      rating: 4.6,
      appointmentTypes: ["in-person", "virtual"],
      bio: "Neurologist with expertise in headache disorders, multiple sclerosis, and neurodegenerative conditions."
    },
    {
      id: 5,
      name: "Dr. Lisa Patel",
      specialty: "pediatrics",
      image: "images/doctors/doctor5.jpg",
      rating: 4.9,
      appointmentTypes: ["in-person", "virtual"],
      bio: "Compassionate pediatrician dedicated to providing comprehensive care for children from birth through adolescence."
    }
  ];
  
  // Mock available time slots (in a real app, this would be dynamic)
  const AVAILABLE_TIMES = {
    "2025-03-25": ["09:00", "10:30", "13:15", "15:45"],
    "2025-03-26": ["08:30", "11:00", "14:00", "16:30"],
    "2025-03-27": ["09:15", "12:45", "14:30", "17:00"],
    "2025-03-28": ["08:00", "10:00", "13:30", "15:00", "16:45"]
  };
  
  // State for the appointment page
  const AppointmentState = {
    filteredDoctors: [],
    selectedDoctor: null,
    selectedDate: null,
    selectedTime: null,
    appointmentType: "in-person",
    searchTerm: "",
    specialtyFilter: ""
  };
  
  // DOM Ready Handler
  document.addEventListener('DOMContentLoaded', () => {
    // Initialize the page
    initializeAppointmentsPage();
    
    // Setup event listeners
    setupEventListeners();
  });
  
  function initializeAppointmentsPage() {
    // Set initial filtered doctors to all doctors
    AppointmentState.filteredDoctors = [...DOCTORS];
    
    // Default to in-person appointments
    AppointmentState.appointmentType = "in-person";
    
    // Render the initial doctors list
    renderDoctorsList();
    
    // Set minimum date for appointment picker to today
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    const datePicker = document.getElementById('appointmentDate');
    
    if (datePicker) {
      datePicker.min = formattedDate;
      
      // Set default to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      datePicker.value = tomorrow.toISOString().split('T')[0];
      AppointmentState.selectedDate = datePicker.value;
    }
  }
  
  function setupEventListeners() {
    // Search box
    const searchBox = document.getElementById('doctorSearch');
    if (searchBox) {
      searchBox.addEventListener('input', handleSearch);
    }
    
    // Specialty filter
    const specialtyFilter = document.getElementById('specialtyFilter');
    if (specialtyFilter) {
      specialtyFilter.addEventListener('change', handleSpecialtyFilter);
    }
    
    // Appointment type toggle
    const typeButtons = document.querySelectorAll('.type-btn');
    typeButtons.forEach(btn => {
      btn.addEventListener('click', handleAppointmentTypeToggle);
    });
    
    // Clear filters button
    const clearFiltersBtn = document.getElementById('clearFilters');
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', clearAllFilters);
    }
    
    // Modal close button
    const closeModalBtn = document.querySelector('.close-modal');
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', closeAppointmentModal);
    }
    
    // Date picker
    const datePicker = document.getElementById('appointmentDate');
    if (datePicker) {
      datePicker.addEventListener('change', handleDateChange);
    }
    
    // Cancel appointment button
    const cancelBtn = document.getElementById('cancelAppointment');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', closeAppointmentModal);
    }
    
    // Confirm appointment button
    const confirmBtn = document.getElementById('confirmAppointment');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', handleAppointmentBooking);
    }
    
    // Click outside modal to close
    const modal = document.getElementById('appointmentModal');
    if (modal) {
      window.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeAppointmentModal();
        }
      });
    }
  }
  
  // Filter Handlers
  function handleSearch(e) {
    AppointmentState.searchTerm = e.target.value.toLowerCase();
    applyFilters();
  }
  
  function handleSpecialtyFilter(e) {
    AppointmentState.specialtyFilter = e.target.value;
    applyFilters();
  }
  
  function handleAppointmentTypeToggle(e) {
    // Remove active class from all type buttons
    document.querySelectorAll('.type-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    // Add active class to clicked button
    e.target.classList.add('active');
    
    // Update state
    AppointmentState.appointmentType = e.target.dataset.type;
    
    // Apply filters
    applyFilters();
  }
  
  function clearAllFilters() {
    // Reset search box
    const searchBox = document.getElementById('doctorSearch');
    if (searchBox) {
      searchBox.value = '';
    }
    
    // Reset specialty filter
    const specialtyFilter = document.getElementById('specialtyFilter');
    if (specialtyFilter) {
      specialtyFilter.value = '';
    }
    
    // Reset appointment type to in-person
    document.querySelectorAll('.type-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.type === 'in-person') {
        btn.classList.add('active');
      }
    });
    
    // Update state
    AppointmentState.searchTerm = '';
    AppointmentState.specialtyFilter = '';
    AppointmentState.appointmentType = 'in-person';
    
    // Apply filters
    applyFilters();
  }
  
  function applyFilters() {
    // Start with all doctors
    let filteredDoctors = [...DOCTORS];
    
    // Apply search term filter
    if (AppointmentState.searchTerm) {
      filteredDoctors = filteredDoctors.filter(doctor => 
        doctor.name.toLowerCase().includes(AppointmentState.searchTerm) ||
        doctor.specialty.toLowerCase().includes(AppointmentState.searchTerm) ||
        doctor.bio.toLowerCase().includes(AppointmentState.searchTerm)
      );
    }
    
    // Apply specialty filter
    if (AppointmentState.specialtyFilter) {
      filteredDoctors = filteredDoctors.filter(doctor => 
        doctor.specialty === AppointmentState.specialtyFilter
      );
    }
    
    // Apply appointment type filter
    filteredDoctors = filteredDoctors.filter(doctor => 
      doctor.appointmentTypes.includes(AppointmentState.appointmentType)
    );
    
    // Update state and render
    AppointmentState.filteredDoctors = filteredDoctors;
    renderDoctorsList();
  }
  
  // UI Rendering
  function renderDoctorsList() {
    const doctorsListContainer = document.getElementById('doctorsList');
    if (!doctorsListContainer) return;
    
    // Clear existing content
    doctorsListContainer.innerHTML = '';
    
    // Show message if no doctors found
    if (AppointmentState.filteredDoctors.length === 0) {
      doctorsListContainer.innerHTML = `
        <div class="no-results">
          <i class="fa fa-search"></i>
          <p>No healthcare providers found matching your criteria</p>
          <button class="btn secondary" onclick="clearAllFilters()">Clear Filters</button>
        </div>
      `;
      return;
    }
    
    // Render each doctor
    AppointmentState.filteredDoctors.forEach(doctor => {
      const doctorCard = document.createElement('div');
      doctorCard.className = 'doctor-card';
      doctorCard.dataset.doctorId = doctor.id;
      
      // Format the specialty for display
      const formattedSpecialty = doctor.specialty.charAt(0).toUpperCase() + doctor.specialty.slice(1);
      const specialtyName = doctor.specialty === 'internal' ? 'Internal Medicine' : formattedSpecialty;
      
      // Create stars for rating
      const starsHtml = createRatingStars(doctor.rating);
      
      doctorCard.innerHTML = `
        <div class="doctor-image">
          <img src="${doctor.image}" alt="${doctor.name}" onerror="this.src='images/default-doctor.png'">
        </div>
        <div class="doctor-info">
          <h3 class="doctor-name">${doctor.name}</h3>
          <p class="doctor-specialty">${specialtyName}</p>
          <div class="doctor-rating">
            ${starsHtml}
            <span class="rating-value">${doctor.rating}</span>
          </div>
          <p class="doctor-bio">${doctor.bio}</p>
          <div class="appointment-badges">
            ${doctor.appointmentTypes.map(type => 
              `<span class="badge ${type === AppointmentState.appointmentType ? 'active' : ''}">${type === 'in-person' ? 'In-Person' : 'Virtual'}</span>`
            ).join('')}
          </div>
        </div>
        <div class="doctor-actions">
          <button class="btn primary schedule-btn" data-doctor-id="${doctor.id}">
            Schedule Appointment
          </button>
        </div>
      `;
      
      // Add to container
      doctorsListContainer.appendChild(doctorCard);
      
      // Add event listener for schedule button
      const scheduleBtn = doctorCard.querySelector('.schedule-btn');
      scheduleBtn.addEventListener('click', () => openAppointmentModal(doctor));
    });
  }
  
  function createRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHtml = '';
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      starsHtml += '<i class="fa fa-star"></i>';
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      starsHtml += '<i class="fa fa-star-half-o"></i>';
    }
    
    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
      starsHtml += '<i class="fa fa-star-o"></i>';
    }
    
    return starsHtml;
  }
  
  // Modal Handling
  function openAppointmentModal(doctor) {
    // Store selected doctor
    AppointmentState.selectedDoctor = doctor;
    
    // Update modal title
    const selectedDoctorElement = document.getElementById('selectedDoctor');
    if (selectedDoctorElement) {
      selectedDoctorElement.textContent = doctor.name;
    }
    
    // Render time slots based on date
    const datePicker = document.getElementById('appointmentDate');
    if (datePicker && datePicker.value) {
      handleDateChange({ target: datePicker });
    } else {
      renderTimeSlots([]);
    }
    
    // Show modal
    const modal = document.getElementById('appointmentModal');
    if (modal) {
      modal.style.display = 'block';
    }
  }
  
  function closeAppointmentModal() {
    // Reset selected time
    AppointmentState.selectedTime = null;
    
    // Hide modal
    const modal = document.getElementById('appointmentModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }
  
  function handleDateChange(e) {
    // Store selected date
    AppointmentState.selectedDate = e.target.value;
    
    // Fetch available time slots for the selected date
    // In a real app, this would be an API call
    const timeSlots = AVAILABLE_TIMES[AppointmentState.selectedDate] || [];
    renderTimeSlots(timeSlots);
  }
  
  function renderTimeSlots(timeSlots) {
    const timeSlotsContainer = document.getElementById('timeSlots');
    if (!timeSlotsContainer) return;
    
    // Clear existing time slots
    timeSlotsContainer.innerHTML = '';
    
    // Show message if no time slots available
    if (timeSlots.length === 0) {
      timeSlotsContainer.innerHTML = `
        <div class="no-time-slots">
          <p>No available appointments on this date</p>
          <p>Please select another date</p>
        </div>
      `;
      return;
    }
    
    // Render time slots
    timeSlots.forEach(time => {
      const timeSlot = document.createElement('div');
      timeSlot.className = 'time-slot';
      timeSlot.dataset.time = time;
      timeSlot.textContent = formatTime(time);
      
      // Add click event
      timeSlot.addEventListener('click', handleTimeSelection);
      
      timeSlotsContainer.appendChild(timeSlot);
    });
  }
  
  function handleTimeSelection(e) {
    // Remove selected class from all time slots
    document.querySelectorAll('.time-slot').forEach(slot => {
      slot.classList.remove('selected');
    });
    
    // Add selected class to clicked time slot
    e.target.classList.add('selected');
    
    // Store selected time
    AppointmentState.selectedTime = e.target.dataset.time;
  }
  
  function formatTime(timeString) {
    // Convert 24-hour format to 12-hour format
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
    
    return `${formattedHour}:${minutes} ${period}`;
  }
  
  // Appointment Booking
  function handleAppointmentBooking() {
    // Validate selection
    if (!AppointmentState.selectedDoctor || !AppointmentState.selectedDate || !AppointmentState.selectedTime) {
      window.Evruriro.showNotification('error', 'Please select a date and time for your appointment');
      return;
    }
    
    const reasonField = document.getElementById('reasonVisit');
    const reason = reasonField ? reasonField.value : '';
    
    // In a real app, this would be an API call
    const appointmentData = {
      doctorId: AppointmentState.selectedDoctor.id,
      date: AppointmentState.selectedDate,
      time: AppointmentState.selectedTime,
      type: AppointmentState.appointmentType,
      reason: reason
    };
    
    // Simulate API call
    bookAppointment(appointmentData);
  }
  
  function bookAppointment(appointmentData) {
    // Show loading state
    const confirmBtn = document.getElementById('confirmAppointment');
    if (confirmBtn) {
      confirmBtn.disabled = true;
      confirmBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Booking...';
    }
    
    // In a real app, this would be an API call
    // For demonstration, we'll use a timeout to simulate an API call
    setTimeout(() => {
      // Reset button
      if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = 'Book Appointment';
      }
      
      // Close modal
      closeAppointmentModal();
      
      // Show success notification
      window.Evruriro.showNotification('success', `Appointment with ${AppointmentState.selectedDoctor.name} booked successfully for ${formatAppointmentDateTime(appointmentData.date, appointmentData.time)}`);
      
      // Add to upcoming appointments
      addToUpcomingAppointments(appointmentData);
    }, 1500);
  }
  
  function formatAppointmentDateTime(date, time) {
    // Format date: Mar 25, 2025
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    // Format time
    const formattedTime = formatTime(time);
    
    return `${formattedDate} at ${formattedTime}`;
  }
  
  function addToUpcomingAppointments(appointmentData) {
    const upcomingAppointmentsContainer = document.getElementById('upcomingAppointments');
    if (!upcomingAppointmentsContainer) return;
    
    // Find doctor info
    const doctor = DOCTORS.find(d => d.id === appointmentData.doctorId);
    if (!doctor) return;
    
    // Create appointment card
    const appointmentCard = document.createElement('div');
    appointmentCard.className = 'appointment-card';
    
    appointmentCard.innerHTML = `
      <div class="appointment-date">${formatAppointmentDate(appointmentData.date)}</div>
      <div class="appointment-doctor">${doctor.name}</div>
      <div class="appointment-type">${appointmentData.type === 'in-person' ? 'In-Person Visit' : 'Virtual Visit'}</div>
      <div class="appointment-time">${formatTime(appointmentData.time)}</div>
    `;
    
    // Add to container (prepend to show newest first)
    upcomingAppointmentsContainer.insertBefore(appointmentCard, upcomingAppointmentsContainer.firstChild);
    
    // Update counts
    updateAppointmentCounts();
  }
  
  function formatAppointmentDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
  
  function updateAppointmentCounts() {
    // This would update any appointment counters in the UI
    // For example, a badge showing the number of upcoming appointments
    const appointmentCounters = document.querySelectorAll('.appointment-counter');
    const count = document.querySelectorAll('.appointment-card').length;
    
    appointmentCounters.forEach(counter => {
      counter.textContent = count;
      
      // Show/hide based on count
      if (count > 0) {
        counter.classList.add('show');
      } else {
        counter.classList.remove('show');
      }
    });
  }
  
  // Favorites handling
  function toggleFavoriteDoctor(doctorId) {
    // Get current favorites from localStorage
    const favorites = JSON.parse(localStorage.getItem('evruriDoctorFavorites') || '[]');
    
    // Check if doctor is already favorited
    const index = favorites.indexOf(doctorId);
    
    if (index === -1) {
      // Add to favorites
      favorites.push(doctorId);
      window.Evruriro.showNotification('success', 'Doctor added to favorites');
    } else {
      // Remove from favorites
      favorites.splice(index, 1);
      window.Evruriro.showNotification('success', 'Doctor removed from favorites');
    }
    
    // Save updated favorites
    localStorage.setItem('evruriDoctorFavorites', JSON.stringify(favorites));
    
    // Update UI
    updateFavoriteIcons();
  }
  
  function updateFavoriteIcons() {
    // Get current favorites
    const favorites = JSON.parse(localStorage.getItem('evruriDoctorFavorites') || '[]');
    
    // Update all favorite buttons
    document.querySelectorAll('.favorite-btn').forEach(btn => {
      const doctorId = parseInt(btn.dataset.doctorId);
      const isFavorite = favorites.includes(doctorId);
      
      // Update icon
      btn.innerHTML = isFavorite ? 
        '<i class="fa fa-heart"></i>' : 
        '<i class="fa fa-heart-o"></i>';
      
      // Update title
      btn.title = isFavorite ? 'Remove from favorites' : 'Add to favorites';
    });
  }
  
  // Load favorite doctors
  function loadFavoriteDoctors() {
    const favorites = JSON.parse(localStorage.getItem('evruriDoctorFavorites') || '[]');
    
    if (favorites.length === 0) return;
    
    // Create a "Favorites" section if we're on the home page
    const homepageContent = document.querySelector('.homepage-content');
    if (!homepageContent) return;
    
    // Create favorites section
    const favoritesSection = document.createElement('section');
    favoritesSection.className = 'favorites-section';
    favoritesSection.innerHTML = `
      <h2>Your Favorite Providers</h2>
      <div class="favorites-container"></div>
    `;
    
    homepageContent.insertBefore(favoritesSection, homepageContent.firstChild);
    
    // Get container
    const container = favoritesSection.querySelector('.favorites-container');
    
    // Add favorite doctors
    favorites.forEach(doctorId => {
      const doctor = DOCTORS.find(d => d.id === doctorId);
      if (!doctor) return;
      
      const doctorCard = document.createElement('div');
      doctorCard.className = 'doctor-card mini';
      
      doctorCard.innerHTML = `
        <div class="doctor-image">
          <img src="${doctor.image}" alt="${doctor.name}" onerror="this.src='images/default-doctor.png'">
        </div>
        <div class="doctor-info">
          <h3 class="doctor-name">${doctor.name}</h3>
          <p class="doctor-specialty">${doctor.specialty}</p>
        </div>
        <div class="doctor-actions">
          <button class="btn outline schedule-mini-btn" data-doctor-id="${doctor.id}">
            Schedule
          </button>
        </div>
      `;
      
      container.appendChild(doctorCard);
      
      // Add event listener for schedule button
      const scheduleBtn = doctorCard.querySelector('.schedule-mini-btn');
      scheduleBtn.addEventListener('click', () => {
        window.location.href = `appointments.html?doctor=${doctor.id}`;
      });
    });
  }
  
  // Check for URL parameters when page loads
  function checkUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const doctorId = urlParams.get('doctor');
    
    if (doctorId) {
      // Find the doctor
      const doctor = DOCTORS.find(d => d.id === parseInt(doctorId));
      if (doctor) {
        // Open appointment modal for this doctor
        setTimeout(() => {
          openAppointmentModal(doctor);
        }, 500);
      }
    }
    
    const specialty = urlParams.get('specialty');
    if (specialty) {
      // Set specialty filter
      const specialtyFilter = document.getElementById('specialtyFilter');
      if (specialtyFilter) {
        specialtyFilter.value = specialty;
        handleSpecialtyFilter({ target: specialtyFilter });
      }
    }
    
    const type = urlParams.get('type');
    if (type && (type === 'in-person' || type === 'virtual')) {
      // Set appointment type
      document.querySelectorAll('.type-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.type === type) {
          btn.classList.add('active');
        }
      });
      
      AppointmentState.appointmentType = type;
      applyFilters();
    }
  }
  
  // Initialize everything when document is ready
  document.addEventListener('DOMContentLoaded', () => {
    initializeAppointmentsPage();
    setupEventListeners();
    checkUrlParameters();
    updateFavoriteIcons();
  });