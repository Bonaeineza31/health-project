# Evuriro Healthcare Application

## Project Overview

Evuriro is a healthcare application designed to help patients manage their health data and medical appointments through seamless API integration.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript, Tailwind CSS
- **Backend**: Node.js
- **Database**: MongoDB
- **Deployment**: Web Servers (Web01 and Web02)
- **Load Balancer**: Distributing traffic between servers

## Local Development to Server Deployment Workflow

### Prerequisites
- Visual Studio Code 
- Git
- SSH access to web servers

### Development Process

1. **Local Development**
   - Develop code locally in VS Code
   - Test and verify functionality on local machine

2. **Deployment Workflow**
   ```bash
   # Connect to Web Server 01
   ssh ubuntu@54.197.202.33

   # Navigate to web directory
   cd /var/www/html

   # Remove existing project (if applicable)
   sudo rm -rf health-project

   # Clone your GitHub repository
   git clone https://github.com/Bonaeineza31/health-project.git

   # Set appropriate permissions
   sudo chown -R ubuntu:ubuntu health-project
   ```

   Repeated the same step for Web Server 02

### Deployment Challenges and Solutions

- **Code Synchronization**: Manually copying code from local VS Code to web servers
- **Solution**: Implemented a consistent git clone and update process
- **Backend API**: Connected to https://evuriro-backend.onrender.com/
- **Backend link**: https://github.com/Bonaeineza31/evuriro-backend.git

## Server Infrastructure
 - **Web Server 01**: `ubuntu@54.197.202.33`
- **Web Server 02**: `ubuntu@3.93.231.111`
- **Load Balancer**: `ubuntu@44.201.230.25`

## Load Balancing Configuration

The load balancer distributes incoming traffic across both web servers, ensuring:
- High availability
- Improved performance
- Seamless user experience

 ## Live Servers:
  **Web Server 01**: http://54.197.202.33/
- **Web Server 02**: http://3.93.231.111/
- **Load Balancer**: http://44.201.230.25/
**Be aware** the above sites are not secured to access our load balancer as it was linked with a Domain access it through  	www.bonaeineza31.tech

## Key Features

- Secure user authentication
- Patient health metrics dashboard
- Appointment scheduling and management
- Real-time data integration with external APIs

## Backend Integration

- **Backend API**: https://evuriro-backend.onrender.com/
- Seamless data fetching and user management

## Deployment Troubleshooting

1. Verify server connectivity
2. Check file permissions
3. Ensure consistent environment
4. Validate API endpoint accessibility

## Future Improvements

- Implement automated deployment scripts
- Enhanced error handling
- More robust API integration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
   
**Developed by:** Ineza Gisubio Bonae
**Project Repository:** https://github.com/Bonaeineza31/health-project
