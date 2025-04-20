/**
 * Device Management API Routes
 * Routes for managing Android devices in sandbox environment
 */

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

/**
 * @route GET /api/devices
 * @description Get all available devices for the authenticated user
 * @access Private
 */
router.get('/', async (req, res) => {
  try {
    // In a real implementation, fetch devices from Airtap API
    // For now, return mock data
    const devices = getMockDevices();
    
    res.status(200).json({
      devices,
      count: devices.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /api/devices/:id
 * @description Get a device by ID
 * @access Private
 */
router.get('/:id', async (req, res) => {
  try {
    const deviceId = req.params.id;
    
    // In a real implementation, fetch device from Airtap API
    // For now, return mock data
    const device = getMockDevice(deviceId);
    
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }
    
    res.status(200).json(device);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /api/devices/:id/screenshot
 * @description Get current screenshot from a device
 * @access Private
 */
router.get('/:id/screenshot', async (req, res) => {
  try {
    const deviceId = req.params.id;
    
    // In a real implementation, fetch screenshot from Airtap API
    // For now, return mock data
    const device = getMockDevice(deviceId);
    
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }
    
    // Mock screenshot data (base64 format)
    const screenshot = {
      deviceId,
      timestamp: new Date().toISOString(),
      format: 'png',
      width: 1080,
      height: 2340,
      data: 'base64_encoded_image_data...' // In real implementation, this would be actual image data
    };
    
    res.status(200).json(screenshot);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route POST /api/devices/:id/reboot
 * @description Reboot a device
 * @access Private
 */
router.post('/:id/reboot', async (req, res) => {
  try {
    const deviceId = req.params.id;
    
    // In a real implementation, reboot device via Airtap API
    // For now, return mock data
    const device = getMockDevice(deviceId);
    
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }
    
    // Update device status to rebooting
    device.status = 'rebooting';
    device.updatedAt = new Date().toISOString();
    
    res.status(200).json({
      deviceId,
      status: 'rebooting',
      message: 'Device reboot initiated'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /api/devices/:id/apps
 * @description Get installed apps on a device
 * @access Private
 */
router.get('/:id/apps', async (req, res) => {
  try {
    const deviceId = req.params.id;
    
    // In a real implementation, fetch apps from Airtap API
    // For now, return mock data
    const device = getMockDevice(deviceId);
    
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }
    
    const apps = getMockInstalledApps();
    
    res.status(200).json({
      deviceId,
      apps,
      count: apps.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Generate mock devices for testing
 * @returns {Array} - Array of mock devices
 */
function getMockDevices() {
  return [
    {
      id: 'device-001',
      name: 'Sandbox Pixel 6',
      model: 'Google Pixel 6',
      androidVersion: '12',
      status: 'online',
      resolution: '1080x2340',
      createdAt: new Date(Date.now() - 86400000 * 30).toISOString(), // 30 days ago
      updatedAt: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
    },
    {
      id: 'device-002',
      name: 'Sandbox Galaxy S21',
      model: 'Samsung Galaxy S21',
      androidVersion: '11',
      status: 'offline',
      resolution: '1440x3200',
      createdAt: new Date(Date.now() - 86400000 * 20).toISOString(), // 20 days ago
      updatedAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
    }
  ];
}

/**
 * Get mock device by ID
 * @param {string} id - Device ID
 * @returns {Object|null} - Mock device or null if not found
 */
function getMockDevice(id) {
  const devices = getMockDevices();
  return devices.find(device => device.id === id) || {
    id,
    name: 'Sandbox Automation Device',
    model: 'Google Pixel 6',
    androidVersion: '12',
    status: 'online',
    resolution: '1080x2340',
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(), // 15 days ago
    updatedAt: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
  };
}

/**
 * Get mock installed apps
 * @returns {Array} - Array of mock installed apps
 */
function getMockInstalledApps() {
  return [
    {
      packageName: 'com.android.chrome',
      appName: 'Chrome',
      versionName: '96.0.4664.45',
      versionCode: 466404500,
      isSystemApp: true
    },
    {
      packageName: 'com.google.android.gm',
      appName: 'Gmail',
      versionName: '2021.11.28.408003856',
      versionCode: 408003856,
      isSystemApp: true
    },
    {
      packageName: 'com.instagram.android',
      appName: 'Instagram',
      versionName: '214.0.0.27.120',
      versionCode: 214000027,
      isSystemApp: false
    },
    {
      packageName: 'com.spotify.music',
      appName: 'Spotify',
      versionName: '8.6.80.1014',
      versionCode: 80068001,
      isSystemApp: false
    },
    {
      packageName: 'org.telegram.messenger',
      appName: 'Telegram',
      versionName: '8.3.0',
      versionCode: 8300,
      isSystemApp: false
    }
  ];
}

module.exports = router;
