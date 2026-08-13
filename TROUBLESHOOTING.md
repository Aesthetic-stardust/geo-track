# 🚀 Geo-Track Startup Checklist

## ⚠️ "This site can't be reached" After Login

This error means the server stopped responding after login. Here's how to fix it:

## 🔧 Immediate Fix

**The issue is likely the server crashed. Check your terminal/console where the server is running.**

### Step 1: Look at Server Console
After you click login, check the terminal. You'll see error messages like:
- `Error loading admin dashboard: ...`
- `SequelizeEagerLoadingError: ...`
- Or the server just stopped

### Step 2: Restart Server Properly

```bash
# Stop the server (Ctrl+C)
# Then restart
npm run xian-start
```

### Step 3: Check Browser Console
1. Press F12 in browser
2. Go to Console tab
3. Look for errors

## 🎯 Most Common Causes

### Cause 1: Database Not Migrated
**Symptoms**: Server crashes when loading dashboard
**Solution**: 
```bash
npm run migrate
```

### Cause 2: Session Not Saving
**Symptoms**: Redirect happens but page says "can't be reached"
**Solution**: Sessions now save properly with the updates. Just restart server.

### Cause 3: Database Relationships Not Working
**Symptoms**: Admin dashboard crashes
**Solution**: Already fixed with try-catch blocks. Restart server.

## ⚡ Quick Fix (Run These Commands)

```bash
# Step 1: Stop server if running (Ctrl+C)

# Step 2: Test database connection
npm test

# Step 3: Run migration (creates tables and users)
npm run migrate

# Step 4: Clean up old files
npm run cleanup

# Step 5: Start the server
npm run xian-start
```

## 🔍 Debug Your Login

### Test 1: Check Session
After starting server, open browser and go to:
```
http://localhost:3000/debug/session
```

You should see:
```json
{
  "session": {},
  "user": null,
  "sessionID": "some-random-id"
}
```

### Test 2: Login and Check Session Again
1. Login at `http://localhost:3000/login`
2. If it redirects successfully, go to `http://localhost:3000/debug/session`
3. You should see your user data:
```json
{
  "session": {...},
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@geotrack.com",
    "role": "admin"
  },
  "sessionID": "some-random-id"
}
```

### Test 3: Check Database
```bash
npm test
```

Expected output:
```
✅ Database connected successfully!
✅ Users table exists (2 users found)
✅ ServiceRequests table exists (0 requests found)

📋 Sample Users:
   - Admin User (admin@geotrack.com) - Role: admin
   - Test Client (client@geotrack.com) - Role: client

✨ All systems operational!
```

## 🔍 Common Issues & Solutions

### Issue 1: "Cannot read partials"
**Solution**: All views have been updated to not use partials anymore. Run `npm run cleanup` to remove old partial files.

### Issue 2: "User not found" when logging in
**Solution**: Database tables don't exist yet. Run `npm run migrate` to create tables and default users.

### Issue 3: "Database connection error"
**Solution**: 
1. Make sure MySQL is running
2. Check if database `geo-track` exists
3. Verify credentials in `models/db.js` (default: root with no password)

### Issue 4: Dashboard shows blank page
**Solution**: 
1. Check browser console (F12) for JavaScript errors
2. Make sure you're logged in (session is active)
3. Try logging out and logging in again

### Issue 5: Maps not loading
**Solution**: You need internet connection for OpenStreetMap tiles to load.

### Issue 6: Server crashes after login
**Solution**:
1. Check server console for error message
2. Most likely database issue - run `npm run migrate`
3. Restart server with `npm run xian-start`

## 📝 Step-by-Step First-Time Setup

### 1. Check MySQL is Running
```bash
# Windows: Check services or run
mysql --version
```

### 2. Test Database Connection
```bash
npm test
```
Expected output:
```
✅ Database connected successfully!
✅ Users table exists
✅ ServiceRequests table exists
```

### 3. Create Tables & Users (if needed)
```bash
npm run migrate
```
When prompted, press **Y** to create database.

Expected output:
```
✅ Database created (if it did not exist)
✅ Connected to MySQL database!
✅ Tables created for all models!
✅ Default admin user created (admin@geotrack.com / admin123)
✅ Default client user created (client@geotrack.com / client123)
```

### 4. Clean Up Old Files
```bash
npm run cleanup
```
Expected output:
```
✅ Deleted: views/request_form.xian
✅ Deleted: views/partials/head.xian
✅ Deleted: views/partials/footer.xian
✅ Deleted: public/tailwind.css
```

### 5. Start the Server
```bash
npm run xian-start
```
Expected output:
```
🔥 XianFire running at http://localhost:3000
```

**IMPORTANT**: Keep this terminal window open and watch for errors!

### 6. Open Browser
Navigate to: `http://localhost:3000`

### 7. Login
Use one of these accounts:

**Admin Dashboard:**
- Email: `admin@geotrack.com`
- Password: `admin123`

**Client Dashboard:**
- Email: `client@geotrack.com`  
- Password: `client123`

### 8. Watch Server Console
When you click "Login", watch the server terminal for any error messages.

## 🎯 What Should You See?

### After Login as Client:
1. Dashboard with welcome message
2. Two action cards: "New Request" and "My Requests"
3. List of available services
4. Logout button

### After Login as Admin:
1. Statistics cards (Pending, Approved, On-going, Completed, Rejected, Total)
2. Workflow visualization
3. Interactive map showing all requests
4. List of all requests with action buttons
5. Filter options

## 🛠️ Still Not Working?

### Check Server Console Output
Look for specific error messages like:
- `SequelizeEagerLoadingError` - Database relationship issue (fixed)
- `Cannot find module` - Missing dependency
- `ECONNREFUSED` - Database not running
- `Session save error` - Session configuration issue (fixed)

### Check These Files:

1. **Database Configuration**: `models/db.js`
   ```javascript
   // Make sure these match your MySQL setup
   export const sequelize = new Sequelize("geo-track", "root", "", {
     host: "localhost",
     dialect: "mysql"
   });
   ```

2. **Session Configuration**: Check if session is working
   - Open browser console (F12)
   - Check Application > Cookies
   - Should see a cookie named `connect.sid`

3. **Server Console**: Look for errors in the terminal where you ran `npm run xian-start`

## 💡 Pro Tips

1. **Always Watch Server Console**: Keep the terminal visible when testing
2. **Use Chrome DevTools**: Press F12 to see JavaScript errors
3. **Check Network Tab**: See if API calls are working
4. **Clear Browser Cache**: Sometimes old files cause issues
5. **Restart Server After Changes**: Ctrl+C and `npm run xian-start`

## 📞 Need More Help?

Check the console output for specific error messages. Common patterns:

**If you see**: "Cannot GET /dashboard"
**Means**: Session not saved, user not logged in
**Fix**: Check `/debug/session` to verify

**If you see**: Server just stops
**Means**: Unhandled error crashed the server
**Fix**: Look at server console for error message

**If you see**: "This site can't be reached" after redirect
**Means**: Server crashed during page load
**Fix**: Check server console, probably database issue

## ✅ Success Indicators

You'll know everything is working when:
- ✅ `npm test` shows all green checkmarks
- ✅ Login page loads with styled form
- ✅ Server console shows no errors after login
- ✅ Dashboard loads successfully
- ✅ `/debug/session` shows your user data
- ✅ Maps load when creating requests
- ✅ Admin can see all requests on map

---

## 🎉 Quick Commands Reference

```bash
npm test              # Test database connection
npm run migrate       # Create tables and users
npm run cleanup       # Remove unused files
npm run xian-start    # Start server (watch for errors!)
npm run xian          # Start with auto-reload (dev mode)
```

## 🐛 Debug URLs

- `http://localhost:3000/debug/session` - Check if you're logged in
- `http://localhost:3000/` - Home page
- `http://localhost:3000/login` - Login page
- `http://localhost:3000/dashboard` - Client dashboard (requires login)
- `http://localhost:3000/admin/dashboard` - Admin dashboard (requires admin login)

