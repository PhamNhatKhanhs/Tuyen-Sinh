const mongoose = require('mongoose');
require('./src/config/db');

async function checkStatuses() {
  try {
    const Application = require('./src/models/Application');
    
    console.log('Checking Application statuses in database...');
    
    // Count by status
    const statusCounts = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    console.log('Status counts:', statusCounts);
    
    // Get some sample data
    const samples = await Application.find({}).limit(5).select('status candidate submissionDate');
    console.log('Sample applications:', samples);
    
    // Test specific status queries
    const pendingCount = await Application.countDocuments({ status: 'pending' });
    const approvedCount = await Application.countDocuments({ status: 'approved' });
    const processingCount = await Application.countDocuments({ status: 'processing' });
    
    console.log('Individual counts:');
    console.log('- Pending:', pendingCount);
    console.log('- Approved:', approvedCount);
    console.log('- Processing:', processingCount);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkStatuses();
