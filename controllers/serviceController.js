/*
MIT License

Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
Mindoro State University - Philippines
*/

import { ServiceRequest } from "../models/serviceRequestModel.js";
import { User } from "../models/userModel.js";

export const requestFormPage = (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  
  // Get user data to pass barangay to template
  res.render("service_request", { 
    title: "Submit Service Request",
    user: req.session.user,
    userBarangay: req.session.user.barangay || 'Sumagui'
  });
};

export const submitRequest = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { serviceType, description, latitude, longitude, address, contactName, contactPhone, priority, barangay } = req.body;
    
    // Get file path if uploaded
    const attachmentPath = req.file ? `/uploads/${req.file.filename}` : null;

    const request = await ServiceRequest.create({
      userId: req.session.user.id,
      serviceType,
      description,
      latitude,
      longitude,
      address,
      barangay,
      attachment: attachmentPath,
      contactName,
      contactPhone,
      priority: priority || 'medium',
      status: 'pending'
    });

    res.json({ success: true, requestId: request.id });
  } catch (error) {
    console.error("Error submitting request:", error);
    res.status(500).json({ error: "Failed to submit request" });
  }
};

export const getMyRequests = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect('/login');
    }

    const requests = await ServiceRequest.findAll({
      where: { userId: req.session.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.render("my_requests", {
      title: "My Requests",
      user: req.session.user,
      requests
    });
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).send("Error loading requests");
  }
};

export const adminDashboard = async (req, res) => {
  try {
    if (!req.session.user || req.session.user.role !== 'admin') {
      return res.redirect('/login');
    }

    let requests = [];
    try {
      requests = await ServiceRequest.findAll({
        include: [{ model: User, attributes: ['name', 'email', 'phone'] }],
        order: [['createdAt', 'DESC']]
      });
    } catch (includeError) {
      console.warn("Could not load requests with user data, loading without:", includeError.message);
      requests = await ServiceRequest.findAll({
        order: [['createdAt', 'DESC']]
      });
    }

    const stats = {
      pending: requests.filter(r => r.status === 'pending').length,
      approved: requests.filter(r => r.status === 'approved').length,
      ongoing: requests.filter(r => r.status === 'ongoing').length,
      completed: requests.filter(r => r.status === 'completed').length,
      rejected: requests.filter(r => r.status === 'rejected').length,
      total: requests.length
    };

    res.render("admin_dashboard", {
      title: "Admin Dashboard - Geo-Track",
      user: req.session.user,
      requests,
      stats
    });
  } catch (error) {
    console.error("Error loading admin dashboard:", error);
    res.status(500).send("Error loading dashboard: " + error.message);
  }
};

export const updateRequestStatus = async (req, res) => {
  try {
    if (!req.session.user || req.session.user.role !== 'admin') {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id, status, notes, assignedTo, rejectionReason } = req.body;

    const updateData = { status };
    if (notes) updateData.notes = notes;
    if (assignedTo) updateData.assignedTo = assignedTo;
    if (rejectionReason) updateData.rejectionReason = rejectionReason;
    if (status === 'completed') updateData.completedAt = new Date();

    await ServiceRequest.update(updateData, { where: { id } });

    res.json({ success: true });
  } catch (error) {
    console.error("Error updating request:", error);
    res.status(500).json({ error: "Failed to update request" });
  }
};

export const getRequestById = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const request = await ServiceRequest.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['name', 'email', 'phone'] }]
    });

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    res.json(request);
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Failed to fetch request" });
  }
};

export const getAllRequestsJson = async (req, res) => {
  try {
    if (!req.session.user || req.session.user.role !== 'admin') {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const requests = await ServiceRequest.findAll({
      include: [{ model: User, attributes: ['name', 'email', 'phone'] }],
      order: [['createdAt', 'DESC']]
    });

    res.json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ error: "Failed to fetch requests" });
  }
};
