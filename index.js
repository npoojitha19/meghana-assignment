// index.js

const axios = require('axios');
const fs = require('fs');
const { CookieJar } = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');

// Login credentials
const EMAIL = 'demo@example.org';
const PASSWORD = 'test';

// Base URL
const BASE_URL = 'https://challenge.sunvoy.com';

const jar = new CookieJar();
const client = wrapper(axios.create({ jar, withCredentials: true }));

async function login() {
  try {
    console.log('Logging in...');
    await client.post(`${BASE_URL}/auth/login`, {
      email: EMAIL,
      password: PASSWORD
    });

    console.log('Login successful');
  } catch (error) {
    console.error('Login failed:', error.message);
    process.exit(1);
  }
}

async function fetchUsers() {
  try {
    console.log('Fetching user list...');
    const response = await client.get(`${BASE_URL}/api/users`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch users:', error.message);
    process.exit(1);
  }
}

async function saveToFile(data, filename = 'users.json') {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`Saved ${data.length} users to ${filename}`);
}

(async () => {
  await login();
  const users = await fetchUsers();
  await saveToFile(users);
})();
