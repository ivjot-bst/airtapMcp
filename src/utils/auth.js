/**
 * Authentication Utilities
 * Handles API token validation and authentication
 */

const axios = require('axios');

// Airtap API base URL
const AIRTAP_API_BASE = 'https://api.airtap.ai';

/**
 * Validates an API token against the Airtap API
 * @param {string} apiToken - API token to validate
 * @returns {Promise} - Promise that resolves if token is valid, rejects if invalid
 */
async function validateApiToken(apiToken) {
  try {
    const response = await axios.get(`${AIRTAP_API_BASE}/auth/validate`, {
      headers: {
        'Authorization': `Bearer ${apiToken}`
      }
    });
    
    if (response.status === 200 && response.data.valid) {
      return response.data;
    } else {
      throw new Error('Invalid API token');
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error('Invalid API token');
    } else {
      throw new Error(`API token validation failed: ${error.message}`);
    }
  }
}

/**
 * Express middleware to verify token in requests
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next function
 */
function verifyTokenMiddleware(req, res, next) {
  // Skip token verification for specific routes
  const openRoutes = ['/health', '/info'];
  if (openRoutes.includes(req.path)) {
    return next();
  }
  
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }
  
  const token = authHeader.split(' ')[1];
  
  // Validate token (in a real implementation, you might want to cache this)
  validateApiToken(token)
    .then(() => {
      // Store token in request for later use
      req.apiToken = token;
      next();
    })
    .catch(error => {
      res.status(401).json({ error: error.message });
    });
}

module.exports = {
  validateApiToken,
  verifyTokenMiddleware
};
