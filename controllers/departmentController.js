/*
MIT License

Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
Mindoro State University - Philippines
*/

import { DepartmentReport } from "../models/departmentReportModel.js";
import { ServiceRequest } from "../models/serviceRequestModel.js";
import { User } from "../models/userModel.js";

// Department categories and their departments
const departments = {
  'Crime & Safety': ['PNP', 'BFP', 'BJMP'],
  'Agriculture': ['DA', 'NIA', 'BFAR'],
  'Incidents & Disasters': ['NDRRMC', 'PAGASA', 'PHIVOLCS'],
  'Aid & Assistance': ['DSWD', 'DOH', 'Red Cross'],
  'Electrical Issues': ['DOE', 'NGCP', 'NEA'],
  'Water & Sanitation': ['MWSS', 'LGU Water District', 'EMB'],
  'Health & Wellness': ['DOH', 'LGU Health Center', 'Philippine Red Cross'],
  'Transportation & Infrastructure': ['DPWH', 'LTO', 'LTFRB']
};

export const submitDepartmentReport = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { serviceRequestId, department, departmentCategory, reason } = req.body;

    // Verify the service request belongs to the user
    const serviceRequest = await ServiceRequest.findByPk(serviceRequestId);
    if (!serviceRequest || serviceRequest.userId !== req.session.user.id) {
      return res.status(403).json({ error: "Unauthorized access to this request" });
    }

    const report = await DepartmentReport.create({
      serviceRequestId,
      department,
      departmentCategory,
      reason,
      status: 'pending'
    });

    res.json({ success: true, reportId: report.id });
  } catch (error) {
    console.error("Error submitting department report:", error);
    res.status(500).json({ error: "Failed to submit report" });
  }
};

export const getDepartmentDashboard = async (req, res) => {
  try {
    const dept = req.params.department;
    console.log("🔍 getDepartmentDashboard called for department:", dept);

    // Verify valid department
    let foundDept = null;
    for (const [category, depts] of Object.entries(departments)) {
      if (depts.includes(dept)) {
        foundDept = category;
        break;
      }
    }

    if (!foundDept) {
      console.log("❌ Department not found:", dept);
      return res.status(404).render("error", { message: "Department not found" });
    }

    console.log("✅ Department found in category:", foundDept);

    const reports = await DepartmentReport.findAll({
      where: { department: dept },
      include: [
        {
          model: ServiceRequest,
          attributes: ['id', 'serviceType', 'description', 'latitude', 'longitude', 'address', 'barangay']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    console.log("📊 Found", reports.length, "reports for", dept);

    const renderData = {
      title: `${dept} - Department Dashboard`,
      department: dept,
      departmentCategory: foundDept,
      reports: reports,
      totalReports: reports.length,
      pendingCount: reports.filter(r => r.status === 'pending').length,
      inProgressCount: reports.filter(r => r.status === 'in-progress').length,
      resolvedCount: reports.filter(r => r.status === 'resolved').length,
      now: new Date(),
      user: req.session.user || {}
    };

    console.log("📝 Rendering with data:", JSON.stringify(renderData, null, 2));
    
    res.render("department_dashboard", renderData);
  } catch (error) {
    console.error("❌ Error loading department dashboard:", error);
    res.status(500).render("error", { message: "Failed to load dashboard" });
  }
};

export const getDepartments = (req, res) => {
  res.json(departments);
};

export const updateReportStatus = async (req, res) => {
  try {
    const reportId = req.params.id;
    const { status } = req.body;

    const report = await DepartmentReport.findByPk(reportId);
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    await report.update({ status });
    res.json({ success: true });
  } catch (error) {
    console.error("Error updating report status:", error);
    res.status(500).json({ error: "Failed to update status" });
  }
};

export { departments };
