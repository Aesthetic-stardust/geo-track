
  /*
    MIT License
    
    Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
    Mindoro State University - Philippines

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
    */
    
import express from "express";
import multer from "multer";
import { homePage } from "../controllers/homeController.js";
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = file.mimetype.split('/')[1];
    cb(null, `${timestamp}-${req.session.user?.id}-${Math.random().toString(36).substr(2, 9)}.${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'));
    }
  }
});

router.get("/", homePage);

import { loginPage, registerPage, forgotPasswordPage, dashboardPage, loginUser, registerUser, logoutUser } from "../controllers/authController.js";
import { requestFormPage, submitRequest, getMyRequests, adminDashboard, updateRequestStatus, getRequestById, getAllRequestsJson } from "../controllers/serviceController.js";
import { submitDepartmentReport, getDepartmentDashboard, updateReportStatus, getDepartments } from "../controllers/departmentController.js";

router.get("/login", loginPage);
router.post("/login", loginUser);
router.get("/register", registerPage);
router.post("/register", registerUser);
router.get("/forgot-password", forgotPasswordPage);
router.get("/dashboard", dashboardPage);
router.get("/logout", logoutUser);

router.get("/request", requestFormPage);
router.post("/api/request", upload.single('attachment'), submitRequest);
router.get("/my-requests", getMyRequests);

router.get("/admin/dashboard", adminDashboard);
router.post("/api/admin/update-status", updateRequestStatus);
router.get("/api/request/:id", getRequestById);
router.get("/api/requests", getAllRequestsJson);

// Department reporting routes
router.post("/api/report-department", submitDepartmentReport);
router.get("/api/departments", getDepartments);
router.get("/department/:department", getDepartmentDashboard);
router.patch("/api/report-status/:id", updateReportStatus);

// Debug route to check session
router.get("/debug/session", (req, res) => {
  res.json({
    session: req.session,
    user: req.session.user,
    sessionID: req.sessionID
  });
});

export default router;
