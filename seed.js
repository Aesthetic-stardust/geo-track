/*
  Seed script for production deployment.
  Run once after deploy: node seed.js
  This is a non-interactive version of migrate.js safe for Render.com.
*/

import { sequelize } from "./models/db.js";
import { User } from "./models/userModel.js";
import { ServiceRequest } from "./models/serviceRequestModel.js";
import { DepartmentReport } from "./models/departmentReportModel.js";
import bcrypt from "bcrypt";

try {
  await sequelize.authenticate();
  console.log("✅ Connected to database!");

  await sequelize.sync({ force: false }); // use force:true only on first run
  console.log("✅ Tables synced!");

  // Check if admin already exists
  const existing = await User.findOne({ where: { email: "admin@geotrack.com" } });
  if (existing) {
    console.log("ℹ️  Seed data already exists. Skipping.");
    process.exit(0);
  }

  const adminPassword = await bcrypt.hash("admin123", 10);
  await User.create({
    name: "Admin User",
    email: "admin@geotrack.com",
    password: adminPassword,
    role: "admin",
    phone: "09123456789"
  });

  const clientPassword = await bcrypt.hash("client123", 10);
  await User.create({
    name: "Test Client",
    email: "client@geotrack.com",
    password: clientPassword,
    role: "client",
    phone: "09987654321",
    barangay: "Sumagui"
  });

  const deptPassword = await bcrypt.hash("dept123", 10);
  await User.create({
    name: "Department User",
    email: "department@geotrack.com",
    password: deptPassword,
    role: "department",
    phone: "09555666777"
  });

  console.log("\n🎉 Seed completed!");
  console.log("   Admin:      admin@geotrack.com / admin123");
  console.log("   Client:     client@geotrack.com / client123");
  console.log("   Department: department@geotrack.com / dept123");

} catch (err) {
  console.error("❌ Seed failed:", err);
} finally {
  process.exit();
}
