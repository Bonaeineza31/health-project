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
    
    // Initialize appointments
    initAppointments();
});

function initAppointments() {
    // Constants
    const API_URL = 'http://localhost:5006'; // Replace with your actual API URL
    const SPECIALTIES = [
        "Cardiology",
        "Internal Medicine",
        "Dermatology",
        "Neurology",
        "Orthopedics",
        "Pediatrics",
        "Psychiatry",
        "Ophthalmology",
        "ENT (Ear, Nose, Throat)",
        "Gynecology",
    ];

    // Mock doctors data
    const MOCK_DOCTORS = [
        {
            _id: "65f1a2b3c4d5e6f7a8b9c0d1",
            name: "Dr. Mutesi Diane",
            specialty: "Cardiology",
            avatar: "/placeholder.svg?height=80&width=80", // Using placeholder for demo
            rating: 4.9,
            reviews: 128,
            hospital: "King Faisal Hospital",
        },
        {
            _id: "65f1a2b3c4d5e6f7a8b9c0d2",
            name: "Dr. Mugabo Jean",
            specialty: "Cardiology",
            avatar: "/placeholder.svg?height=80&width=80",
            rating: 4.7,
            reviews: 93,
            hospital: "Rwanda Military Hospital",
        },
        {
            _id: "65f1a2b3c4d5e6f7a8b9c0d3",
            name: "Dr. Uwase Claire",
            specialty: "Internal Medicine",
            avatar: "/placeholder.svg?height=80&width=80",
            rating: 4.8,
            reviews: 156,
            hospital: "CHUK (Centre Hospitalier Universitaire de Kigali)",
        },
        {
            _id: "65f1a2b3c4d5e6f7a8b9c0d4",
            name: "Dr. Nshimiyimana Eric",
            specialty: "Internal Medicine",
            avatar: "/placeholder.svg?height=80&width=80",
            rating: 4.6,
            reviews: 112,
            hospital: "Kibagabaga Hospital",
        },
        {
            _id: "65f1a2b3c4d5e6f7a8b9c0d5",
            name: "Dr. Mukamana Grace",
            specialty: "Dermatology",
            avatar: "/placeholder.svg?height=80&width=80",
            rating: 4.9,
            reviews: 204,
            hospital: "Masaka Hospital",
        },
        {
            _id: "65f1a2b3c4d5e6f7a8b9c0d6",
            name: "Dr. Ndayishimiye Patrick",
            specialty: "Neurology",
            avatar: "/placeholder.svg?height=80&width=80",
            rating: 4.8,
            reviews: 87,
            hospital: "Butaro Hospital",
        },
    ];

    // State variables
    let doctors = [...MOCK_DOCTORS];
    let filteredDoctors = [...MOCK_DOCTORS];
    let selectedDoctor = null;
    let appointmentType = "in-person";
    let selectedDate = "";
    let selectedTime = "";
    let selectedLocation = "";
    let timeSlots = [];
    let existingAppointments = [];
    let bookingConflicts = [];
    let step = 1;

    // DOM Elements
    const step1Element = document.getElementById('step1');
    const step2Element = document.getElementById('step2');
    const searchQueryInput = document.getElementById('searchQuery');
    const specialtySelect = document.getElementById('specialtySelect');
    const inPersonBtn = document.getElementById('inPersonBtn');
    const virtualBtn = document.getElementById('virtualBtn');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    const doctorsListElement = document.getElementById('doctorsList');
    const backButton = document.getElementById('backButton');
    const selectedDoctorAvatar = document.getElementById('selectedDoctorAvatar');
    const selectedDoctorName = document.getElementById('selectedDoctorName');
    const selectedDoctorSpecialty = document.getElementById('selectedDoctorSpecialty');
    const selectedDoctorHospital = document.getElementById('selectedDoctorHospital');
    const appointmentTypeLabel = document.getElementById('appointmentTypeLabel');
    const bookingConflictsElement = document.getElementById('bookingConflicts');
    const conflictsList = document.getElementById('conflictsList');
    const appointmentDateInput = document.getElementById('appointmentDate');
    const locationSelect = document.getElementById('locationSelect');
    const checkAvailabilityBtn = document.getElementById('checkAvailabilityBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const timeSlotsContainer = document.getElementById('timeSlotsContainer');
    const timeSlotsElement = document.getElementById('timeSlots');
    const appointmentReasonTextarea = document.getElementById('appointmentReason');
    const insuranceProviderInput = document.getElementById('insuranceProvider');
    const memberIdInput = document.getElementById('memberId');
    const summaryDoctor = document.getElementById('summaryDoctor');
    const summarySpecialty = document.getElementById('summarySpecialty');
    const summaryDate = document.getElementById('summaryDate');
    const summaryTime = document.getElementById('summaryTime');
    const summaryLocation = document.getElementById('summaryLocation');
    const summaryType = document.getElementById('summaryType');
    const bookAppointmentBtn = document.getElementById('bookAppointmentBtn');
    const appointmentForm = document.getElementById('appointmentForm');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const successMessage = document.getElementById('successMessage');
    const successText = document.getElementById('successText');

    // Set today's date as the minimum date for appointment
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    appointmentDateInput.min = formattedToday;

    // Populate specialties dropdown
    populateSpecialties();

    // Render doctors list
    renderDoctorsList();

    // Add event listeners
    addEventListeners();

    // Populate specialties dropdown
    function populateSpecialties() {
        SPECIALTIES.forEach(specialty => {
            const option = document.createElement('option');
            option.value = specialty;
            option.textContent = specialty;
            specialtySelect.appendChild(option);
        });
    }

    // Render doctors list
    function renderDoctorsList() {
        doctorsListElement.innerHTML = '';

        if (filteredDoctors.length === 0) {
            doctorsListElement.innerHTML = `
                <div class="no-results2">
                    <p>No doctors found matching your criteria. Try adjusting your filters.</p>
                </div>
            `;
            return;
        }

        filteredDoctors.forEach(doctor => {
            const doctorCard = document.createElement('div');
            doctorCard.className = 'doctor-card2';
            doctorCard.dataset.id = doctor._id;

            doctorCard.innerHTML = `
                <div class="doctor-avatar2">
                    <img src="${doctor.avatar}" alt="${doctor.name}" class="avatar-placeholder">
                </div>
                <div class="doctor-info2">
                    <h3>${doctor.name}</h3>
                    <p class="specialty">${doctor.specialty}</p>
                    <p class="hospital">${doctor.hospital}</p>
                    <div class="doctor-rating">
                        <span class="stars">${'★'.repeat(Math.round(doctor.rating))}</span>
                        <span class="rating-number2">
                            ${doctor.rating} (${doctor.reviews} reviews)
                        </span>
                    </div>
                    ${appointmentType === "teleconsultation" ?
                        '<span class="virtual-badge2">Virtual Available</span>' : ''}
                </div>
                <button class="select-doctor-btn2">Select</button>
            `;

            doctorCard.addEventListener('click', () => handleDoctorSelect(doctor));
            doctorsListElement.appendChild(doctorCard);
        });
    }

    // Add event listeners
    function addEventListeners() {
        // Search and filter events
        searchQueryInput.addEventListener('input', filterDoctors);
        specialtySelect.addEventListener('change', filterDoctors);
        inPersonBtn.addEventListener('click', () => {
            appointmentType = 'in-person';
            inPersonBtn.classList.add('active');
            virtualBtn.classList.remove('active');
            renderDoctorsList();
            updateSummary();
        });
        virtualBtn.addEventListener('click', () => {
            appointmentType = 'teleconsultation';
            virtualBtn.classList.add('active');
            inPersonBtn.classList.remove('active');
            renderDoctorsList();
            updateSummary();
        });
        clearFiltersBtn.addEventListener('click', clearFilters);

        // Back button
        backButton.addEventListener('click', goBack);

        // Date selection
        appointmentDateInput.addEventListener('change', handleDateChange);

        // Check availability button
        checkAvailabilityBtn.addEventListener('click', checkAvailability);

        // Form submission
        appointmentForm.addEventListener('submit', handleSubmit);
    }

    // Filter doctors based on search and specialty
    function filterDoctors() {
        const searchQuery = searchQueryInput.value.toLowerCase();
        const specialty = specialtySelect.value;

        filteredDoctors = doctors.filter(doctor => {
            let matchesSearch = true;
            let matchesSpecialty = true;

            if (searchQuery) {
                matchesSearch = doctor.name.toLowerCase().includes(searchQuery) ||
                                doctor.specialty.toLowerCase().includes(searchQuery);
            }

            if (specialty) {
                matchesSpecialty = doctor.specialty === specialty;
            }

            return matchesSearch && matchesSpecialty;
        });

        renderDoctorsList();
    }

    // Clear all filters
    function clearFilters() {
        searchQueryInput.value = '';
        specialtySelect.value = '';
        filteredDoctors = [...doctors];
        renderDoctorsList();
    }

    // Handle doctor selection
    function handleDoctorSelect(doctor) {
        selectedDoctor = doctor;

        // Update doctor preview
        selectedDoctorAvatar.src = doctor.avatar;
        selectedDoctorAvatar.alt = doctor.name;
        selectedDoctorName.textContent = doctor.name;
        selectedDoctorSpecialty.textContent = doctor.specialty;
        selectedDoctorHospital.textContent = doctor.hospital;
        appointmentTypeLabel.textContent = appointmentType === 'teleconsultation' ?
            'Virtual Appointment' : 'In-Person Visit';

        // Update locations
        updateLocations();

        // Update summary
        updateSummary();

        // Switch to step 2
        goToStep(2);
    }

    // Update locations based on selected doctor
    function updateLocations() {
        locationSelect.innerHTML = '';

        // In a real app, these would be fetched from an API
        const locations = [
            selectedDoctor.hospital,
            "Nyarugenge District Hospital",
            "Remera Health Center"
        ];

        locations.forEach(location => {
            const option = document.createElement('option');
            option.value = location;
            option.textContent = location;
            locationSelect.appendChild(option);
        });

        selectedLocation = locations[0];
        locationSelect.value = selectedLocation;

        // Add event listener for location change
        locationSelect.addEventListener('change', () => {
            selectedLocation = locationSelect.value;
            updateSummary();
        });
    }

    // Handle date change
    function handleDateChange(e) {
        selectedDate = e.target.value;
        selectedTime = '';
        timeSlots = [];
        timeSlotsContainer.classList.add('hidden');

        // Check for booking conflicts
        checkBookingConflicts();

        // Update summary
        updateSummary();

        // Disable book button until time is selected
        bookAppointmentBtn.disabled = true;
    }

    // Check for booking conflicts
    function checkBookingConflicts() {
        if (!selectedDate || existingAppointments.length === 0) {
            bookingConflictsElement.classList.add('hidden');
            return;
        }

        // Filter appointments for the selected date
        bookingConflicts = existingAppointments.filter(apt => {
            const aptDate = new Date(apt.date).toISOString().split('T')[0];
            return aptDate === selectedDate;
        });

        if (bookingConflicts.length > 0) {
            // Show conflicts
            conflictsList.innerHTML = '';
            bookingConflicts.forEach(conflict => {
                const li = document.createElement('li');
                li.textContent = `${conflict.time} with ${conflict.doctor?.name || 'Unknown Doctor'} (${conflict.speciality})`;
                conflictsList.appendChild(li);
            });
            bookingConflictsElement.classList.remove('hidden');
        } else {
            bookingConflictsElement.classList.add('hidden');
        }
    }

    // Check availability for the selected date
    function checkAvailability() {
        if (!selectedDate || !selectedDoctor) {
            showError('Please select a date and doctor to check availability.');
            return;
        }

        // Show loading spinner
        loadingSpinner.classList.remove('hidden');
        timeSlotsContainer.classList.add('hidden');

        // In a real app, this would be an API call
        // Simulating API call with setTimeout
        setTimeout(() => {
            // Generate mock time slots
            timeSlots = [];
            const startHour = 8;
            const endHour = 17;

            for (let hour = startHour; hour <= endHour; hour++) {
                for (const minutes of ['00', '30']) {
                    // Skip lunch hour
                    if (hour === 12 && minutes === '30') continue;
                    if (hour === 13 && minutes === '00') continue;

                    const timeString = `${hour > 12 ? hour - 12 : hour}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
                    const isAvailable = Math.random() > 0.3; // 70% chance of availability for demo

                    timeSlots.push({
                        time: timeString,
                        available: isAvailable,
                    });
                }
            }

            // Render time slots
            renderTimeSlots();

            // Hide loading spinner
            loadingSpinner.classList.add('hidden');
            timeSlotsContainer.classList.remove('hidden');
        }, 1000);
    }

    // Render time slots
    function renderTimeSlots() {
        timeSlotsElement.innerHTML = '';

        timeSlots.forEach(slot => {
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = slot.time;
            button.className = `time-slot ${slot.available ? 'available' : 'unavailable'}`;
            button.disabled = !slot.available;

            if (slot.available) {
                button.addEventListener('click', () => {
                    // Deselect all other time slots
                    document.querySelectorAll('.time-slot.selected').forEach(el => {
                        el.classList.remove('selected');
                    });

                    // Select this time slot
                    button.classList.add('selected');
                    selectedTime = slot.time;

                    // Update summary
                    updateSummary();

                    // Enable book button
                    bookAppointmentBtn.disabled = false;
                });
            }

            timeSlotsElement.appendChild(button);
        });
    }

    // Update appointment summary
    function updateSummary() {
        summaryDoctor.textContent = selectedDoctor ? selectedDoctor.name : 'Not selected';
        summarySpecialty.textContent = selectedDoctor ? selectedDoctor.specialty : 'Not selected';
        summaryDate.textContent = selectedDate ? formatDate(selectedDate) : 'Not selected';
        summaryTime.textContent = selectedTime || 'Not selected';
        summaryLocation.textContent = selectedLocation || 'Not selected';
        summaryType.textContent = appointmentType === 'teleconsultation' ? 'Virtual (Video Call)' : 'In-Person Visit';
    }

    // Format date for display
    function formatDate(dateString) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // Handle form submission
    function handleSubmit(e) {
        e.preventDefault();

        if (!selectedDoctor || !selectedDate || !selectedTime) {
            showError('Please complete all required fields.');
            return;
        }

        // Show loading state
        bookAppointmentBtn.disabled = true;
        bookAppointmentBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Processing...';

        // Create appointment data
        const appointmentData = {
            doctor: selectedDoctor._id,
            speciality: selectedDoctor.specialty,
            date: selectedDate,
            time: selectedTime,
            type: appointmentType,
            notes: appointmentReasonTextarea.value,
            location: selectedLocation
        };

        console.log('Submitting appointment data:', appointmentData);

        // In a real app, this would be an API call
        // Simulating API call with setTimeout
        setTimeout(() => {
            // Simulate successful appointment creation
            const message = `Your appointment with ${selectedDoctor.name} has been scheduled for ${formatDate(selectedDate)} at ${selectedTime}.`;
            showSuccess(message);

            // Redirect to dashboard after a delay
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);
        }, 1500);
    }

    // Show error message
    function showError(message) {
        errorText.textContent = message;
        errorMessage.classList.remove('hidden');

        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorMessage.classList.add('hidden');
        }, 5000);
    }

    // Show success message
    function showSuccess(message) {
        successText.textContent = message;
        successMessage.classList.remove('hidden');
        step1Element.classList.add('hidden');
        step2Element.classList.add('hidden');
    }

    // Go to step
    function goToStep(newStep) {
        step = newStep;

        if (step === 1) {
            step1Element.style.display = 'block';
            step2Element.style.display = 'none';
        } else {
            step1Element.style.display = 'none';
            step2Element.style.display = 'block';
        }
    }

    // Go back to step 1
    function goBack() {
        goToStep(1);
    }

    // Listen for theme change events from sidebar
    document.addEventListener('themeChange', (e) => {
        document.documentElement.setAttribute('data-theme', e.detail.theme);
    });

    // Listen for language change events from navbar
    document.addEventListener('languageChange', (e) => {
        // In a real app, this would update all text elements with translations
        console.log('Language changed to:', e.detail.language);
    });
}