// Simple test to check if the backend APIs are working
fetch('http://localhost:5001/api/universities')
  .then(response => response.json())
  .then(data => {
    console.log('Universities found:', data.length);
    if (data.length > 0) {
      const firstUniv = data[0];
      console.log('First university:', firstUniv.name, 'ID:', firstUniv.id);
      
      // Test majors for first university
      return fetch(`http://localhost:5001/api/majors?universityId=${firstUniv.id}`);
    }
  })
  .then(response => response.json())
  .then(majors => {
    console.log('Majors found:', majors.length);
    if (majors.length > 0) {
      const firstMajor = majors[0];
      console.log('First major:', firstMajor.name, 'ID:', firstMajor.id);
      
      // Test admission methods for first major
      return fetch(`http://localhost:5001/api/major-admission-subject-groups?majorId=${firstMajor.id}&year=2024`);
    }
  })
  .then(response => response.json())
  .then(admissionData => {
    console.log('Admission method mappings found:', admissionData.length);
    if (admissionData.length > 0) {
      const methods = [...new Set(admissionData.map(item => item.admissionMethod?.name))];
      console.log('Available methods:', methods);
    }
    console.log('Test completed successfully!');
  })
  .catch(error => {
    console.error('Test failed:', error.message);
  });
