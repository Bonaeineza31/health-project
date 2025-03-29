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
    
    // Initialize hospitals
    initHospitals();
});

function initHospitals() {
    // DOM Elements
    const profileDropdown = document.getElementById('profileDropdown');
    const profileMenu = document.getElementById('profileMenu');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const shareLocationBtn = document.getElementById('share-location-btn');
    const tryAgainBtn = document.getElementById('try-again-btn');
    const locationRequest = document.getElementById('location-request');
    const locationLoading = document.getElementById('location-loading');
    const locationDenied = document.getElementById('location-denied');
    const hospitalSearch = document.getElementById('hospital-search');
    const searchBtn = document.getElementById('search-btn');
    const distanceFilter = document.getElementById('distance-filter');
    const specialtyFilter = document.getElementById('specialty-filter');
    const hospitalsList = document.getElementById('hospitals-list');

    // State variables
    let userLocation = null;
    let searchRadius = 10;
    let searchQuery = '';
    let selectedSpecialty = 'all';
    let locationPermission = 'pending';

    // Sample hospital data (Rwandan hospitals)
    const rwandanHospitals = [
        {
            id: 1,
            name: "King Faisal Hospital",
            address: "KG 544 St, Kigali",
            phone: "+250 252 588 888",
            distance: 2.3,
            specialties: ["Emergency", "Cardiology", "Neurology", "Surgery", "Oncology"],
            waitTime: "15 min",
            rating: 4.7,
            openNow: true
        },
        {
            id: 2,
            name: "CHUK (University Teaching Hospital of Kigali)",
            address: "KN 4 Ave, Kigali",
            phone: "+250 788 868 240",
            distance: 3.8,
            specialties: ["Emergency", "Surgery", "Internal Medicine", "Pediatrics"],
            waitTime: "30 min",
            rating: 4.2,
            openNow: true
        },
        {
            id: 3,
            name: "CHUB (University Teaching Hospital of Butare)",
            address: "Huye District, Southern Province",
            phone: "+250 252 530 000",
            distance: 5.1,
            specialties: ["Emergency", "Surgery", "Internal Medicine", "Pediatrics", "Gynecology"],
            waitTime: "25 min",
            rating: 4.0,
            openNow: true
        },
        {
            id: 4,
            name: "Kibagabaga Hospital",
            address: "KG 28 Ave, Kigali",
            phone: "+250 788 484 444",
            distance: 4.2,
            specialties: ["Emergency", "Obstetrics", "Pediatrics", "Surgery"],
            waitTime: "20 min",
            rating: 3.9,
            openNow: true
        },
        {
            id: 5,
            name: "Rwanda Military Hospital",
            address: "KK 15 Rd, Kigali",
            phone: "+250 788 305 703",
            distance: 6.5,
            specialties: ["Emergency", "Orthopedics", "Cardiology", "Surgery"],
            waitTime: "15 min",
            rating: 4.3,
            openNow: true
        },
        {
            id: 6,
            name: "Masaka Hospital",
            address: "Masaka, Kicukiro District",
            phone: "+250 788 423 332",
            distance: 8.7,
            specialties: ["Emergency", "Pediatrics", "Obstetrics", "Internal Medicine"],
            waitTime: "35 min",
            rating: 3.8,
            openNow: true
        },
        {
            id: 7,
            name: "Nyamata Hospital",
            address: "Bugesera District, Eastern Province",
            phone: "+250 788 565 656",
            distance: 12.4,
            specialties: ["Emergency", "Surgery", "Pediatrics"],
            waitTime: "40 min",
            rating: 3.7,
            openNow: false
        }
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

    // Function to get user location
    const getUserLocation = () => {
        locationRequest.style.display = 'none';
        locationLoading.style.display = 'flex';
        locationPermission = 'loading';

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    locationPermission = 'granted';
                    locationLoading.style.display = 'none';

                    // Filter and display hospitals
                    filterAndDisplayHospitals();
                },
                (error) => {
                    console.error("Error getting location:", error);
                    locationPermission = 'denied';
                    locationLoading.style.display = 'none';
                    locationDenied.style.display = 'flex';

                    // Still display hospitals, but they won't be sorted by actual distance
                    filterAndDisplayHospitals();
                }
            );
        } else {
            locationPermission = 'unavailable';
            locationLoading.style.display = 'none';
            locationDenied.style.display = 'flex';

            // Display hospitals without location
            filterAndDisplayHospitals();
        }
    };

    // Share location button
    if (shareLocationBtn) {
        shareLocationBtn.addEventListener('click', getUserLocation);
    }

    // Try again button
    if (tryAgainBtn) {
        tryAgainBtn.addEventListener('click', getUserLocation);
    }

    // Search button
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            searchQuery = hospitalSearch.value.trim().toLowerCase();
            filterAndDisplayHospitals();
        });
    }

    // Search on Enter key
    if (hospitalSearch) {
        hospitalSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchQuery = hospitalSearch.value.trim().toLowerCase();
                filterAndDisplayHospitals();
            }
        });
    }

    // Distance filter change
    if (distanceFilter) {
        distanceFilter.addEventListener('change', () => {
            searchRadius = parseInt(distanceFilter.value);
            filterAndDisplayHospitals();
        });
    }

    // Specialty filter change
    if (specialtyFilter) {
        specialtyFilter.addEventListener('change', () => {
            selectedSpecialty = specialtyFilter.value;
            filterAndDisplayHospitals();
        });
    }

    // Filter and display hospitals based on user inputs
    const filterAndDisplayHospitals = () => {
        let filteredHospitals = [...rwandanHospitals];

        // Filter by search query
        if (searchQuery) {
            filteredHospitals = filteredHospitals.filter(hospital =>
                hospital.name.toLowerCase().includes(searchQuery) ||
                hospital.address.toLowerCase().includes(searchQuery) ||
                hospital.specialties.some(specialty =>
                    specialty.toLowerCase().includes(searchQuery)
                )
            );
        }

        // Filter by specialty
        if (selectedSpecialty !== 'all') {
            filteredHospitals = filteredHospitals.filter(hospital =>
                hospital.specialties.some(specialty =>
                    specialty.toLowerCase() === selectedSpecialty.toLowerCase()
                )
            );
        }

        // Filter by distance
        filteredHospitals = filteredHospitals.filter(hospital =>
            hospital.distance <= searchRadius
        );

        // Sort by distance
        filteredHospitals.sort((a, b) => a.distance - b.distance);

        // Display hospitals
        displayHospitals(filteredHospitals);
    };

    // Display hospitals in the list
    const displayHospitals = (hospitals) => {
        hospitalsList.innerHTML = '';

        if (hospitals.length === 0) {
            hospitalsList.innerHTML = `
                <div class="no-results">
                    <p>No hospitals found matching your criteria. Try adjusting your filters.</p>
                </div>
            `;
            return;
        }

        hospitals.forEach(hospital => {
            const hospitalCard = document.createElement('div');
            hospitalCard.className = 'hospital-card';

            hospitalCard.innerHTML = `
                <div class="hospital-header">
                    <h2>${hospital.name}</h2>
                    <div class="hospital-distance">
                        <span class="material-icons">place</span>
                        <span>${hospital.distance} km away</span>
                    </div>
                </div>

                <div class="hospital-details">
                    <div class="hospital-address">
                        <span class="material-icons">location_on</span>
                        <span>${hospital.address}</span>
                    </div>

                    <div class="hospital-phone">
                        <span class="material-icons">phone</span>
                        <span>${hospital.phone}</span>
                    </div>
                </div>

                <div class="hospital-status">
                    <div class="wait-time">
                        <span class="material-icons">schedule</span>
                        <span>Wait time: ${hospital.waitTime}</span>
                    </div>

                    <div class="open-status ${hospital.openNow ? 'open' : 'closed'}">
                        ${hospital.openNow ? 'Open Now' : 'Closed'}
                    </div>
                </div>

                <div class="hospital-specialties">
                    ${hospital.specialties.map(specialty =>
                        `<span class="specialty-tag">${specialty}</span>`
                    ).join('')}
                </div>

                <div class="hospital-rating">
                    <div class="stars">
                        ${generateStars(hospital.rating)}
                        <span class="rating-value">${hospital.rating}</span>
                    </div>
                </div>

                <div class="hospital-actions">
                    <button class="primary-button" onclick="getDirections('${hospital.address}')">Get Directions</button>
                    <button class="secondary-button" onclick="callHospital('${hospital.phone}')">Call Hospital</button>
                </div>
            `;

            hospitalsList.appendChild(hospitalCard);
        });
    };

    // Generate star rating HTML
    const generateStars = (rating) => {
        let starsHtml = '';

        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) {
                starsHtml += '<span class="material-icons filled">star</span>';
            } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
                starsHtml += '<span class="material-icons filled">star_half</span>';
            } else {
                starsHtml += '<span class="material-icons empty">star_border</span>';
            }
        }

        return starsHtml;
    };

    // Initialize the page - display all hospitals initially
    filterAndDisplayHospitals();

    // If we already have location permission, get location automatically
    if (navigator.permissions && navigator.permissions.query) {
        navigator.permissions.query({ name: 'geolocation' }).then(result => {
            if (result.state === 'granted') {
                getUserLocation();
            }
        });
    }

    // Get directions function
    window.getDirections = function(address) {
        const encodedAddress = encodeURIComponent(address);
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
    }

    // Call hospital function
    window.callHospital = function(phone) {
        window.location.href = `tel:${phone}`;
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