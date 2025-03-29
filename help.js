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
    
    // Initialize help center
    initHelpCenter();
});

function initHelpCenter() {
    // FAQ Data
    const faqData = {
        appointment: [
            {
                question: "How do I prepare for my teleconsultation?",
                answer: "Be ready 5 minutes before your scheduled time. Ensure you have a stable internet connection in a quiet, well-lit area. Test your camera and microphone, prepare a list of your current medications, and have your questions ready for the doctor."
            },
            {
                question: "How do I reschedule my appointment?",
                answer: "You can reschedule your appointment by going to the 'Appointments' section, selecting your appointment, and clicking on the 'Reschedule' button. Please note that reschedules should be done at least 24 hours in advance."
            },
            {
                question: "What should I do if my doctor is late?",
                answer: "Please remain in the virtual waiting room. If your doctor is more than 15 minutes late, you'll receive a notification with options to either continue waiting or reschedule your appointment."
            }
        ],
        technical: [
            {
                question: "My video or audio isn't working. What should I do?",
                answer: "First, check if your camera and microphone are properly connected and permitted in your browser settings. Try refreshing the page. If issues persist, you can click on 'Test your camera and microphone' in the appointment preparation section."
            },
            {
                question: "How do I use the chat feature during consultation?",
                answer: "During your consultation, click on the 'Open Chat' button in the top right corner. This allows you to send text messages to your doctor if you're experiencing audio issues or need to share specific information."
            },
            {
                question: "Can I use Evruriro on my mobile device?",
                answer: "Yes, Evruriro is fully compatible with smartphones and tablets. You can download our app from the App Store or Google Play, or use a mobile browser to access our platform."
            }
        ],
        billing: [
            {
                question: "How do I update my insurance information?",
                answer: "Go to your Profile settings, select 'Insurance Information', and click 'Update'. You can add new insurance details or modify existing ones. Make sure to save your changes."
            },
            {
                question: "Will my insurance cover teleconsultation?",
                answer: "Most insurance providers now cover teleconsultation services. You can verify your coverage by checking with your insurance provider or clicking on 'Verify Insurance Coverage' in your appointment details."
            },
            {
                question: "How do I get a receipt for my consultation?",
                answer: "After your consultation, a receipt will be automatically generated and sent to your email. You can also find all your receipts in the 'Billing' section of your account."
            }
        ],
        medical: [
            {
                question: "How do I access my medical records?",
                answer: "You can access your medical records by clicking on 'Medical Records' in the left sidebar. There you'll find your consultation history, prescriptions, test results, and other medical documents."
            },
            {
                question: "Can I share my test results with my doctor?",
                answer: "Yes, you can upload and share your test results before or during your consultation. Go to 'Medical Records', click 'Upload Documents', and select the files you want to share."
            },
            {
                question: "How do I get a prescription after my consultation?",
                answer: "If your doctor prescribes medication during your consultation, the prescription will be sent to your preferred pharmacy and will also be available in your 'Medical Records' section for download."
            }
        ],
        privacy: [
            {
                question: "Is my teleconsultation private and secure?",
                answer: "Yes, all teleconsultations are conducted through a secure, encrypted connection that complies with healthcare privacy regulations. Your medical information and consultation details are kept confidential."
            },
            {
                question: "Who can access my medical information?",
                answer: "Only you and your healthcare providers have access to your medical information. You can control access permissions in the 'Privacy Settings' section of your account."
            },
            {
                question: "Can I request a copy of my personal data?",
                answer: "Yes, you can request a copy of your personal data by going to 'Settings' > 'Privacy & Security' > 'Data Request'. Processing typically takes 3-5 business days."
            }
        ]
    };

    // DOM Elements
    const helpCategories = document.getElementById('helpCategories');
    const faqSectionTitle = document.getElementById('faqSectionTitle');
    const faqList = document.getElementById('faqList');
    const helpSearchForm = document.getElementById('helpSearchForm');
    const helpSearchInput = document.getElementById('helpSearchInput');
    const contactSupportBtn = document.getElementById('contactSupportBtn');
    const contactFormModal = document.getElementById('contactFormModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const contactForm = document.getElementById('contactForm');

    // State variables
    let activeCategory = 'appointment';
    let searchQuery = '';

    // Render FAQs based on active category
    function renderFAQs() {
        faqList.innerHTML = '';

        const faqs = searchQuery ?
            Object.values(faqData).flat().filter(faq =>
                faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
            ) :
            faqData[activeCategory];

        if (faqs.length === 0) {
            faqList.innerHTML = '<p class="no-results">No results found. Try different keywords or browse our categories.</p>';
            return;
        }

        faqs.forEach((faq, index) => {
            const faqItem = document.createElement('div');
            faqItem.className = 'faq-item';

            faqItem.innerHTML = `
                <details>
                    <summary>${faq.question}</summary>
                    <p>${faq.answer}</p>
                </details>
            `;

            faqList.appendChild(faqItem);
        });
    }

    // Update category title and icon
    function updateCategoryTitle() {
        const categoryData = {
            appointment: { name: 'Appointments', icon: 'fa-calendar' },
            technical: { name: 'Technical Support', icon: 'fa-wrench' },
            billing: { name: 'Billing & Insurance', icon: 'fa-money' },
            medical: { name: 'Medical Questions', icon: 'fa-medkit' },
            privacy: { name: 'Privacy & Security', icon: 'fa-shield' }
        };

        if (searchQuery) {
            faqSectionTitle.innerHTML = `
                <span class="category-icon-header">
                    <i class="fa fa-search"></i>
                </span>
                Search Results
            `;
        } else {
            const category = categoryData[activeCategory];
            faqSectionTitle.innerHTML = `
                <span class="category-icon-header">
                    <i class="fa ${category.icon}"></i>
                </span>
                ${category.name}
            `;
        }
    }

    // Category switching
    helpCategories.addEventListener('click', (e) => {
        const categoryItem = e.target.closest('li');
        if (categoryItem) {
            const category = categoryItem.getAttribute('data-category');

            // Remove active class from all categories
            document.querySelectorAll('#helpCategories li').forEach(item => {
                item.classList.remove('active');
            });

            // Add active class to clicked category
            categoryItem.classList.add('active');

            // Update active category and render FAQs
            activeCategory = category;
            searchQuery = '';
            helpSearchInput.value = '';
            updateCategoryTitle();
            renderFAQs();
        }
    });

    // Search functionality
    helpSearchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        searchQuery = helpSearchInput.value.trim().toLowerCase();
        updateCategoryTitle();
        renderFAQs();
    });

    // Contact form modal
    contactSupportBtn.addEventListener('click', () => {
        contactFormModal.style.display = 'flex';
    });

    closeModalBtn.addEventListener('click', () => {
        contactFormModal.style.display = 'none';
    });

    // Close modal when clicking outside
    contactFormModal.addEventListener('click', (e) => {
        if (e.target === contactFormModal) {
            contactFormModal.style.display = 'none';
        }
    });

    // Contact form submission
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Here you would typically handle the form submission,
        // such as sending the data to a server
        alert('Your message has been sent. Our support team will get back to you shortly.');

        // Reset form
        contactForm.reset();

        // Close modal
        contactFormModal.style.display = 'none';
    });

    // Listen for theme change events from sidebar
    document.addEventListener('themeChange', (e) => {
        document.documentElement.setAttribute('data-theme', e.detail.theme);
    });

    // Initialize the page
    renderFAQs();
}