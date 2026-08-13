
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
    
import { sequelize } from "./models/db.js";
import { User } from "./models/userModel.js";
import { ServiceRequest } from "./models/serviceRequestModel.js";
import { DepartmentReport } from "./models/departmentReportModel.js";
import inquirer from "inquirer";
import bcrypt from "bcrypt";

const { createDb } = await inquirer.prompt([
  { type: "confirm", name: "createDb", message: "Database 'geo-track' may not exist. Create it?", default: true }
]);

if (createDb) {
  await sequelize.query("CREATE DATABASE IF NOT EXISTS `geo-track`;");
  console.log("✅ Database created (if it did not exist)");
}

try {
  await sequelize.authenticate();
  console.log("✅ Connected to MySQL database!");
  
  await sequelize.sync({ force: true });
  console.log("✅ Tables created for all models!");
  
  // Create default admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  await User.create({
    name: "Admin User",
    email: "admin@geotrack.com",
    password: adminPassword,
    role: "admin",
    phone: "09123456789"
  });
  console.log("✅ Default admin user created (admin@geotrack.com / admin123)");
  
  // Create default client user
  const clientPassword = await bcrypt.hash("client123", 10);
  await User.create({
    name: "Test Client",
    email: "client@geotrack.com",
    password: clientPassword,
    role: "client",
    phone: "09987654321",
    barangay: "Sumagui"
  });
  console.log("✅ Default client user created (client@geotrack.com / client123)");
  
  // Create department user
  const deptPassword = await bcrypt.hash("dept123", 10);
  await User.create({
    name: "Department User",
    email: "department@geotrack.com",
    password: deptPassword,
    role: "department",
    phone: "09555666777"
  });
  console.log("✅ Department user created (department@geotrack.com / dept123)");
  
  console.log("\n🎉 Migration completed successfully!");
  console.log("\n📝 Login Credentials:");
  console.log("   Admin: admin@geotrack.com / admin123");
  console.log("   Client: client@geotrack.com / client123");
  console.log("   Department: department@geotrack.com / dept123");
  
} catch (err) {
  console.error("❌ Migration failed:", err);
} finally {
  process.exit();
};
