const axios = require('axios');
const statusUtils = require('../utils/statusUtils');

// Check a single website and record status
exports.checkWebsite = async (website, prisma) => {
  const startTime = Date.now();
  let status = 0;
  let responseTime = 0;
  let error = null;
  
  try {
    const response = await axios.get(website.url, {
      timeout: 10000 // 10 seconds timeout
    });
    
    status = response.status;
    responseTime = Date.now() - startTime;
  } catch (err) {
    error = err.message;
    if (err.response) {
      status = err.response.status;
    } else {
      status = 0; // Connection error
    }
    responseTime = Date.now() - startTime;
  }
  
  // Update website last checked timestamp
  await prisma.website.update({
    where: { id: website.id },
    data: { lastCheckedAt: new Date() }
  });
  
  // Record the status check
  const statusCheck = await prisma.statusCheck.create({
    data: {
      websiteId: website.id,
      status,
      responseTime,
      error,
      checkedAt: new Date()
    }
  });
  
  // Generate alerts for status changes
  await this.generateAlerts(website.id, status, responseTime, prisma);
  
  return {
    id: statusCheck.id,
    websiteId: website.id,
    status: statusUtils.determineStatus(status, responseTime),
    statusCode: status,
    responseTime,
    error,
    checkedAt: statusCheck.checkedAt
  };
};

// Generate alerts when status changes
exports.generateAlerts = async (websiteId, currentStatus, responseTime, prisma) => {
  const previousChecks = await prisma.statusCheck.findMany({
    where: { websiteId },
    orderBy: { checkedAt: 'desc' },
    take: 2
  });
  
  if (previousChecks.length < 2) return;
  
  const website = await prisma.website.findUnique({
    where: { id: websiteId }
  });
  
  const currentStatusLabel = statusUtils.determineStatus(currentStatus, responseTime);
  const previousStatusLabel = statusUtils.determineStatus(
    previousChecks[1].status, 
    previousChecks[1].responseTime
  );
  
  // Status degraded
  if (previousStatusLabel === 'online' && currentStatusLabel !== 'online') {
    await prisma.alert.create({
      data: {
        websiteId,
        message: `Website ${website.name} is now ${currentStatusLabel.toUpperCase()}. Response code: ${currentStatus}, Response time: ${responseTime}ms`,
        isRead: false
      }
    });
  }
  
  // Status improved
  else if (previousStatusLabel !== 'online' && currentStatusLabel === 'online') {
    await prisma.alert.create({
      data: {
        websiteId,
        message: `Website ${website.name} has recovered and is now ${currentStatusLabel.toUpperCase()}`,
        isRead: false
      }
    });
  }
};

// Run periodic checks for all active websites
exports.runScheduledChecks = async (prisma) => {
  const websites = await prisma.website.findMany({
    where: { isActive: true }
  });
  
  for (const website of websites) {
    const lastChecked = website.lastCheckedAt;
    const checkIntervalMs = website.checkInterval * 60 * 1000; // Convert minutes to ms
    
    if (!lastChecked || Date.now() - new Date(lastChecked).getTime() >= checkIntervalMs) {
      console.log(`Checking website: ${website.name} (${website.url})`);
      await this.checkWebsite(website, prisma);
    }
  }
};