// index.js

const axios = require('axios');
const fs = require('fs');
const { CookieJar } = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');

// Credentials
const EMAIL = 'demo@example.org';
const PASSWORD = 'test';
const BASE_URL = 'https://challenge.sunvoy.com';

const jar = new CookieJar();
const client = wrapper(axios.create({ jar, withCredentials: true }));

// Login and store session cookies
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

// Fetch list of users
async function fetchUsers() {
  try {
    console.log('Fetching users...');
    const res = await client.get(`${BASE_URL}/api/users`);
    return res.data;
  } catch (error) {
    console.error('Error fetching users:', error.message);
    process.exit(1);
  }
}

// Fetch current authenticated user's info
async function fetchCurrentUser() {
  try {
    console.log('Fetching current user info...');
    const res = await client.get(`${BASE_URL}/settings`);
    return res.data;
  } catch (error) {
    console.error('Error fetching current user:', error.message);
    return null;
  }
}

// Save to users.json
function saveToFile(users, currentUser) {
  const data = [...users];

  if (currentUser) {
    data.push({ currentUser });
  }

  fs.writeFileSync('users.json', JSON.stringify(data, null, 2), 'utf-8');
  console.log(`Saved ${data.length} items to users.json`);
}

// Main script execution
(async () => {
  await login();
  const users = await fetchUsers();
  const currentUser = await fetchCurrentUser();
  saveToFile(users, currentUser);
})();
