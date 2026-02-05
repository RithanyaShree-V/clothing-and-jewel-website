const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Employee = require('../models/Employee');
const Admin = require('../models/Admin');
const connectDB = require('../config/db');

const seedEmployees = async () => {
  try {
    await connectDB();

    // Find or create an admin first
    let admin = await Admin.findOne({ phoneNumber: '8438859659' });
    if (!admin) {
      admin = new Admin({
        phoneNumber: '8438859659',
        name: 'Admin',
        password: 'admin123',
        role: 'super-admin',
        isActive: true
      });
      await admin.save();
      console.log('✅ Admin created');
    }

    // Clear existing employees
    await Employee.deleteMany({});

    // Create default employee
    const employee = new Employee({
      phoneNumber: '9876543210',
      email: 'employee@vedhas.com',
      name: 'Employee',
      password: 'employee123',
      adminId: admin._id,
      isActive: true,
      permissions: {
        canAccessStock: true,
        canAccessOrders: false,
        canAccessUsers: false,
        canAccessDiscounts: false
      }
    });

    await employee.save();
    console.log('✅ Employee seeded successfully!');
    console.log('Phone: 9876543210');
    console.log('Permissions: Stock Management only');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding employees:', error);
    process.exit(1);
  }
};

seedEmployees();
