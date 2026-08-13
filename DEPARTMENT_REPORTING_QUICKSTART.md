# Quick Start - Department Reporting System

## What Was Added

### Files Created:
1. `models/departmentReportModel.js` - Database model for department reports
2. `controllers/departmentController.js` - Business logic controller
3. `views/department_dashboard.xian` - Clean dashboard for departments

### Files Modified:
1. `views/my_requests.xian` - Added report button and modal
2. `routes/index.js` - Added 4 new routes
3. `migrate.js` - Added DepartmentReport to migration

## How to Use

### For Clients:
1. Go to "My Requests" page
2. Find a pending request that's taking too long
3. Click the orange "📢 Report to Department" button
4. Select the appropriate department category
5. Select the specific department from the list
6. Type your reason (why you're reporting this)
7. Click "Submit Report"
8. Page refreshes - your report is now with the department

### For Departments:
1. Access the dashboard at: `http://localhost:3000/department/[DEPARTMENT_NAME]`
   - Replace [DEPARTMENT_NAME] with: PNP, BFP, DA, DOH, etc.
   - Examples:
     - `/department/PNP` - Philippine National Police
     - `/department/DA` - Department of Agriculture
     - `/department/DOH` - Department of Health
2. View:
   - Statistics cards (pending, in-progress, resolved)
   - Table of all reports
   - Submission dates and times
   - Service types and locations (barangay)
   - Report reasons
3. Update status:
   - Select new status from dropdown (pending → received → in-progress → resolved)
   - Click "Update" button
   - Dashboard refreshes with new status

## Available Departments

**Crime & Safety**
- PNP (Philippine National Police)
- BFP (Bureau of Fire Protection)
- BJMP (Bureau of Corrections)

**Agriculture**
- DA (Department of Agriculture)
- NIA (National Irrigation Administration)
- BFAR (Bureau of Fisheries & Aquatic Resources)

**Incidents & Disasters**
- NDRRMC (National Disaster Risk Reduction Management Council)
- PAGASA (Weather Bureau)
- PHIVOLCS (Volcano Monitoring)

**Aid & Assistance**
- DSWD (Department of Social Welfare)
- DOH (Department of Health)
- Red Cross

**Electrical Issues**
- DOE (Department of Energy)
- NGCP (National Grid Corporation)
- NEA (National Electrification Administration)

**Water & Sanitation**
- MWSS (Manila Water Supply)
- LGU Water District
- EMB (Environmental Management Bureau)

**Health & Wellness**
- DOH (Department of Health)
- LGU Health Center
- Philippine Red Cross

**Transportation & Infrastructure**
- DPWH (Department of Public Works)
- LTO (Land Transportation Office)
- LTFRB (Land Transportation Franchising Board)

## Database

After running migration, the system creates the `DepartmentReports` table with:
- Auto-incrementing ID
- Link to service request
- Department name and category
- Reason for report
- Status tracking (pending → received → in-progress → resolved)
- Timestamps

## API Endpoints

```
POST   /api/report-department       Submit a new department report
GET    /api/departments             Get all departments (JSON)
GET    /department/:department      View department dashboard
PATCH  /api/report-status/:id       Update report status
```

## Security

✅ Users can only report their own requests  
✅ All inputs validated on server  
✅ Session authentication required  
✅ Foreign key constraints prevent orphaned data  

## Testing

1. **Create a pending request** as a client
2. **Click "Report to Department"** on that request
3. **Select a department** and provide reason
4. **Submit the report**
5. **Access department dashboard**: `http://localhost:3000/department/DOH`
6. **See your report** in the table
7. **Update status** and verify refresh

---

**Status**: Ready to use immediately after migration!  
**Database**: Run `node migrate.js` if not already done  
**Server**: Running on `http://localhost:3000`
