## Evuriro Healthcare Platform
# Project Overview

Evuriro is a comprehensive healthcare platform designed to help patients in Rwanda manage their health data, medical appointments, and connect with healthcare providers through seamless API integration. The platform aims to improve healthcare accessibility and patient outcomes through digital solutions.
## Demo Video: Watch the Evuriro Platform Demo here (https://youtu.be/wrO2PrEY0Ls)

## Key Features

User Authentication: Secure login/signup system with JWT token-based authentication
Patient Dashboard: Real-time health metrics visualization and monitoring
Appointment Management: Schedule, reschedule, and cancel medical appointments
Medical Records: Secure storage and retrieval of patient medical history
Teleconsultation: Virtual meetings with healthcare providers
Hospital Locator: Find and get directions to nearby healthcare facilities
Device Integration: Connect with medical devices to monitor vital signs

## Technologies Used
# Frontend

HTML/CSS: Modern, responsive UI components
JavaScript: Dynamic client-side functionality

# Backend

Node.js: JavaScript runtime for server-side logic
Express.js: Web application framework for API endpoints
MongoDB: NoSQL database for flexible data storage
JWT: JSON Web Tokens for secure authentication

# DevOps

Git: Version control system
GitHub: Code repository and collaboration
Render.com: Backend API hosting
AWS EC2: Web server hosting

## API Integration
The platform integrates with a custom-built RESTful API hosted at https://evuriro-backend.onrender.com that provides the following endpoints:

# Authentication 

POST /user/register: Create new user accounts
POST /user/login: Authenticate existing users
GET /user/profile: Retrieve user profile information


# Appointments

GET /appointments: Retrieve user appointments
POST /appointments: Create new appointments
PUT /appointments/:id: Update existing appointments
DELETE /appointments/:id: Cancel appointments



## External APIs Used
This project integrates with the following third-party APIs:


# Google Maps API

Used for hospital location services and directions
Documentation: https://developers.google.com/maps
Attribution: © Google Maps Platform



### API Security
The API implements several security measures:

#JWT Authentication: All protected endpoints require a valid JWT token
HTTPS: All API traffic is encrypted using TLS/SSL
CORS: Configured to only accept requests from authorized domains
Rate Limiting: Prevents abuse through request throttling (100 requests per hour)
Input Validation: Sanitizes all user inputs to prevent injection attacks
Secure Storage: API keys are stored in environment variables, never in code

#### Error Handling Strategy
The application implements a comprehensive error handling approach:

Frontend Validation: Client-side form validation to catch errors early
API Error Responses: Standardized error response format with appropriate HTTP status codes
jsonCopy{
  "status": "error",
  "code": 404,
  "message": "Appointment not found",
  "details": "The requested appointment ID does not exist in our records"
}

Graceful Degradation: Fallback UI components when API services are unavailable
Error Logging: Centralized error logging for monitoring and debugging
User Feedback: Clear error messages displayed to users with recovery suggestions
Retry Mechanism: Automatic retry for temporary network failures

### Local Development Setup
Prerequisites

Node.js 
Git 
MongoDB 


# Installation Steps
bashCopy# Clone the repository
git clone https://github.com/Bonaeineza31/health-project.git

# Navigate to project directory
cd health-project

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env file with your API keys and database connection string
# Required variables:
# - MONGODB_URI
# - JWT_SECRET
# - GOOGLE_MAPS_API_KEY
# - PORT (default: 3000)

# Start the development server
npm start

# Access the application
# Open your browser and navigate to http://localhost:3000
Troubleshooting Common Issues

MongoDB Connection Errors: Ensure MongoDB is running locally with mongod
API Key Errors: Verify all API keys in your .env file are correct
CORS Issues: When testing locally, ensure your API allows requests from localhost
Port Conflicts: If port 3000 is in use, modify the PORT value in your .env file

Deployment Guide
Web Server Configuration
The application is deployed on two AWS EC2 instances running Ubuntu 22.04 LTS:
bashCopy# Connect to Web Server
ssh ubuntu@54.197.202.33

# Navigate to web directory
cd /var/www/html

# Clone repository
git clone https://github.com/Bonaeineza31/health-project.git

# Set proper permissions
sudo chown -R ubuntu:ubuntu health-project

# Install dependencies
cd health-project
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with production values

# Start application with PM2
pm2 start app.js --name "evuriro"
pm2 save
pm2 startup

# Configure Nginx as reverse proxy
sudo nano /etc/nginx/sites-available/evuriro
# Add the following configuration:
# server {
#     listen 80;
#     server_name 54.197.202.33;
#
#     location / {
#         proxy_pass http://localhost:3000;
#         proxy_http_version 1.1;
#         proxy_set_header Upgrade $http_upgrade;
#         proxy_set_header Connection 'upgrade';
#         proxy_set_header Host $host;
#         proxy_cache_bypass $http_upgrade;
#     }
# }

# Enable the site
sudo ln -s /etc/nginx/sites-available/evuriro /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
The same deployment process was followed for Web Server 02 (3.93.231.111).
Load Balancer Configuration
The load balancer (44.201.230.25) is configured with Nginx to distribute traffic between the two web servers:
bashCopy# Connect to Load Balancer
ssh ubuntu@44.201.230.25

# Install Nginx
sudo apt update
sudo apt install nginx -y

# Configure load balancer
sudo nano /etc/nginx/sites-available/load-balancer

# Add the following configuration:
# upstream backend {
#     server 54.197.202.33;
#     server 3.93.231.111;
# }
#
# server {
#     listen 80;
#     server_name 44.201.230.25 www.bonaeineza31.tech;
#
#     location / {
#         proxy_pass http://backend;
#         proxy_set_header Host $host;
#         proxy_set_header X-Real-IP $remote_addr;
#         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
#         proxy_set_header X-Forwarded-Proto $scheme;
#
#         # Health check
#         health_check interval=10 fails=3 passes=2;
#
#         # Session persistence using IP hash
#         proxy_next_upstream error timeout http_500;
#     }
# }

# Enable the site
sudo ln -s /etc/nginx/sites-available/load-balancer /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
This configuration includes:

Round-robin algorithm for traffic distribution
Health checks to ensure requests are only routed to operational servers
Session persistence to maintain user sessions
Error handling for failed upstream servers

## User Interaction with Data
The platform provides several ways for users to interact with their health data:

1. Searching
Global search functionality allows users to search across all patient data with:

Keyword-based search across all medical records
Advanced search with multiple parameters
Autocomplete suggestions for medical terms
Results grouped by category (Appointments, Records, Medications)

2. Visualization
Interactive charts for vital signs and health metrics:

Line charts for tracking trends over time (blood pressure, weight, etc.)
Downloadable reports in PDF format
Printing records

## Challenges and Solutions
# Challenge 1: Cross-Origin Resource Sharing (CORS)
Problem: API requests from the frontend were blocked by CORS policies when deployed to different domains.
Solution:

Implemented proper CORS headers on the backend
Configured the API to accept requests from authorized domains
Added middleware to Express.js application:
javascriptCopyapp.use(cors({
  origin: ['http://54.197.202.33', 'http://3.93.231.111', 'http://44.201.230.25', 'http://www.bonaeineza31.tech'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


# Challenge 2: User Authentication
Problem: Needed a secure, stateless authentication system that works across multiple servers.
Solution:

Implemented JWT-based authentication with token refresh mechanism
Stored tokens in HTTP-only cookies to prevent XSS attacks
Added token expiration and refresh functionality
Implemented secure password hashing with bcrypt

# Challenge 3: Load Balancing
Problem: Ensuring high availability and consistent user experience across multiple servers.
Solution:

Configured Nginx load balancer with health checks
Implemented session persistence using IP hashing
Set up automatic failover to handle server outages
Added monitoring to track server performance and load distribution

# Testing
The application has been thoroughly tested using:

Cross-Browser Testing: Verified functionality in Chrome, Firefox, Safari, and Edge

## Future Improvements

Progressive Web App (PWA): Enable offline functionality and push notifications
AI-Powered Diagnostics: Implement machine learning for preliminary symptom analysis
Telemedicine Integration: Add video consultation capabilities
Health Insurance Integration: Connect with insurance providers for claims processing
Mobile Applications: Develop native iOS and Android applications
Multi-language Support: Add support for Kinyarwanda and French
Accessibility Enhancements: Improve compliance with WCAG guidelines

## Live Servers

Web Server 01: http://54.197.202.33/
Web Server 02: http://3.93.231.111/
Load Balancer: http://44.201.230.25/
Domain Access: www.bonaeineza31.tech

## User Guide
# How to Register

Navigate to the signup page
Enter your personal information
Verify your email address
Complete your health profile

# How to Book an Appointment

Log in to your account
Navigate to the Appointments section
Select "Book New Appointment" with the doctor you prefer
Choose your preferred doctor, date, and time
Confirm your booking

# How to View Medical Records

Navigate to the Medical Records section
Use filters to find specific records
Click on a record to view details
Export or share as needed

## Contributors

Ineza Gisubio Bonae - Lead Developer

##  License
This project is licensed under the MIT License

## Acknowledgements
Special thanks to:

Google Maps Platform for location services
MongoDB Atlas for database hosting
The open source community for various libraries used in this project
