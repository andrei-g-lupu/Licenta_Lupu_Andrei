const axios = require('axios');

const registerUser = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/register', {
      username: 'firstuser',
      email: 'firstuser@example.com',
      password: 'SecurePassword123',
    });

    console.log('User registered successfully:');
    console.log(response.data);
  } catch (error) {
    if (error.response) {
      console.error('Error:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
};

registerUser();