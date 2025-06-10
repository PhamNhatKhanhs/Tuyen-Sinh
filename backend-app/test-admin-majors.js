const axios = require('axios');

const API_BASE_URL = 'http://localhost:5001/api';

async function testAdminMajorsFilter() {
  try {
    // Step 1: Login as admin
    console.log('🔐 Logging in as admin...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'admin@example.com',
      password: 'password123' // Default password from seed data
    });
    
    if (!loginResponse.data.success) {
      console.error('❌ Login failed:', loginResponse.data.message);
      return;
    }
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful, token obtained');
    
    // Step 2: Test admin majors endpoint without filter
    console.log('\n📋 Testing admin majors endpoint without filter...');
    const majorsResponse = await axios.get(`${API_BASE_URL}/admin/majors`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Response status:', majorsResponse.status);
    console.log('Response data:', JSON.stringify(majorsResponse.data, null, 2));
    
    // Step 3: Test admin majors endpoint with university filter
    console.log('\n🏫 Testing admin majors endpoint with university filter...');
    const universityId = '6847ce4ca40e57d9b184adbb'; // Đại học Bách Khoa Hà Nội
    const filteredResponse = await axios.get(`${API_BASE_URL}/admin/majors`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { universityId }
    });
    
    console.log('Filtered response status:', filteredResponse.status);
    console.log('Filtered response data:', JSON.stringify(filteredResponse.data, null, 2));
    
  } catch (error) {
    console.error('🚨 Error during test:', error.message);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
  }
}

testAdminMajorsFilter();
