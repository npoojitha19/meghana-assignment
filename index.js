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
    const res = await client.
