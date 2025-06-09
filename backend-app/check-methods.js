const mongoose = require('mongoose');
const AdmissionMethod = require('./src/models/AdmissionMethod');

mongoose.connect('mongodb://localhost:27017/university_admission_dev')
  .then(async () => {
    console.log('Connected to MongoDB');
    const methods = await AdmissionMethod.find({}).sort({name: 1});
    console.log('\n=== ADMISSION METHODS IN DATABASE ===');
    methods.forEach((method, index) => {
      console.log(`${index + 1}. ID: ${method._id}`);
      console.log(`   Name: ${method.name}`);
      console.log(`   Code: ${method.code || 'N/A'}`);
      console.log(`   Active: ${method.isActive}`);
      console.log('   ---');
    });
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
