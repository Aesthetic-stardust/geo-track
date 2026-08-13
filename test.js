// Quick Test Script for Geo-Track
import { sequelize } from "./models/db.js";
import { User } from "./models/userModel.js";
import { ServiceRequest } from "./models/serviceRequestModel.js";

console.log("🧪 Testing Geo-Track Database Connection...\n");

try {
  await sequelize.authenticate();
  console.log("✅ Database connected successfully!");
  
  // Test Users table
  const userCount = await User.count();
  console.log(`✅ Users table exists (${userCount} users found)`);
  
  // Test ServiceRequests table
  const requestCount = await ServiceRequest.count();
  console.log(`✅ ServiceRequests table exists (${requestCount} requests found)`);
  
  if (userCount === 0) {
    console.log("\n⚠️  No users found! Run: npm run migrate");
  } else {
    console.log("\n📋 Sample Users:");
    const users = await User.findAll({ limit: 5, attributes: ['id', 'name', 'email', 'role'] });
    users.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) - Role: ${user.role}`);
    });
  }
  
  console.log("\n✨ All systems operational!");
  
} catch (error) {
  console.error("❌ Test failed:", error.message);
  console.log("\n💡 Suggestions:");
  console.log("   1. Make sure MySQL is running");
  console.log("   2. Check database credentials in models/db.js");
  console.log("   3. Run: npm run migrate");
} finally {
  process.exit();
}
