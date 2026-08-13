/*
MIT License

Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
Mindoro State University - Philippines
*/

import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";
import { ServiceRequest } from "./serviceRequestModel.js";

export const DepartmentReport = sequelize.define("DepartmentReport", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  serviceRequestId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: ServiceRequest,
      key: 'id'
    }
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Department being reported to (e.g., PNP, BFP, DA, etc.)'
  },
  departmentCategory: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Category of department (Crime & Safety, Agriculture, etc.)'
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'received', 'in-progress', 'resolved'),
    defaultValue: 'pending'
  }
}, {
  timestamps: true
});

DepartmentReport.belongsTo(ServiceRequest, { foreignKey: 'serviceRequestId' });
ServiceRequest.hasMany(DepartmentReport, { foreignKey: 'serviceRequestId' });

export { sequelize };
