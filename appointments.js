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
      time: AppointmentState.selectedTime