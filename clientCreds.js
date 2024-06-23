const axios = require('axios');
const https = require('https');

const tokenEndpoint = 'https://localhost:5001/connect/token';
const apiEndpoint = 'https://localhost:5001/api/yourapiendpoint'; // Replace with your actual API endpoint

const clientId = "client_credentials_client";
const clientSecret = 'secret';
const scope = 'api_scope rick_sanchez_api';

// Create an https agent that ignores self-signed certificates
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

// Function to get the access token
async function getAccessToken() {
  try {
    const response = await axios.post(
      tokenEndpoint,
      new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
        scope: scope,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        httpsAgent // Add the https agent here
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Error obtaining access token:', error.response ? error.response.data : error.message);
    throw error;
  }
}

// Function to call the API with the access token
async function callApi(accessToken) {
  try {
    const response = await axios.get(apiEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      httpsAgent // Add the https agent here
    });
    console.log('API response:', response.data);
  } catch (error) {
    console.error('Error calling API:', error.response ? error.response.data : error.message);
  }
}

// Main function to get the token and call the API
(async () => {
  try {
    const accessToken = await getAccessToken();
    console.log('Access Token:', accessToken);
    await callApi(accessToken);
  } catch (error) {
    console.error('Error in main function:', error.message);
  }
})();
