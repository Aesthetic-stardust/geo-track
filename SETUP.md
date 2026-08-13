# Geo-Track Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Database
Make sure MySQL is running and create the database:
```sql
CREATE DATABASE `geo-track`;
```

Or use the migration script which will create it automatically.

### 3. Run Database Migration
```bash
npm run migrate
```

This will:
- Create the database (if it doesn't exist)
- Create all necessary tables (Users, ServiceRequests)
- Create default users:
  - **Admin**: admin@geotrack.com / admin123
  - **Client**: client@geotrack.com / client123

### 4. Clean Up Unused Files
```bash
node cleanup.js
```

### 5. Start the Application
```bash
npm run xian-start
```

Or for development with auto-reload:
```bash
npm run xian
```

### 6. Access the Application
Open your browser and navigate to:
```
http://localhost:3000
```

## 📋 Default Login Credentials

### Admin Account
- **Email**: admin@geotrack.com
- **Password**: admin123
- **Access**: Full admin dashboard with workflow visualization and request management

### Client Account
- **Email**: client@geotrack.com
- **Password**: client123
- **Access**: Submit requests, view own requests

## 🗺️ Features

### For Clients:
1. **Submit Service Requests** - Use interactive map to pinpoint exact location
2. **Track Requests** - Monitor status: Pending → Approved → On-going → Completed
3. **View History** - See all submitted requests with timeline

### For Admins:
1. **Dashboard Overview** - Real-time statistics of all requests
2. **Workflow Visualization** - Visual representation of request stages
3. **Map View** - See all requests plotted on map with color-coded status
4. **Request Management** - Approve, reject, assign, and complete requests
5. **Filtering** - Filter by status and service type

## 🛠️ Service Types Available
- Garbage Collection
- Road Repair
- Street Light Repair
- Water Supply Issue
- Drainage Problem
- Tree Trimming
- Community Health
- Public Safety
- Other

## 📊 Database Schema

### Users Table
- id, name, email, password, role (admin/client), phone, address

### ServiceRequests Table
- id, userId, serviceType, description, latitude, longitude, address
- status (pending/approved/ongoing/completed/rejected)
- priority (low/medium/high/urgent)
- contactName, contactPhone, assignedTo, notes, completedAt
- timestamps (createdAt, updatedAt)

## 🔧 Troubleshooting

### Dashboard not showing?
1. Make sure you're logged in
2. Check if the session is active
3. Verify database tables are created (run `npm run migrate`)
4. Check browser console for errors

### Map not loading?
- Ensure you have internet connection (uses OpenStreetMap tiles)
- Check browser console for any JavaScript errors

### Cannot login?
- Verify database connection
- Make sure migration was successful
- Use default credentials provided above

## 🌐 Technology Stack
- **Backend**: Node.js + Express
- **Database**: MySQL + Sequelize ORM
- **Frontend**: Vanilla JS + Handlebars (HBS)
- **Maps**: Leaflet.js + OpenStreetMap
- **Framework**: XianFire (Custom Framework by Christian I. Cabrera)

## 📝 Project Structure
```
geo-track/
├── controllers/
│   ├── authController.js
│   ├── homeController.js
│   └── serviceController.js
├── models/
│   ├── db.js
│   ├── userModel.js
│   └── serviceRequestModel.js
├── routes/
│   └── index.js
├── views/
│   ├── admin_dashboard.xian
│   ├── dashboard.xian
│   ├── home.xian
│   ├── login.xian
│   ├── register.xian
│   ├── service_request.xian
│   └── my_requests.xian
├── public/
├── index.js
├── migrate.js
└── cleanup.js
```

## 📄 License
MIT License - Copyright (c) 2025 Christian I. Cabrera
