
const monitoringService = require('../services/monitoringService');
const statusUtils = require('../utils/statusUtils');

// Add a new website
exports.addWebsite = async (req, res) => {
  const { prisma } = req;
  try {
    const { name, url, checkInterval = 5 } = req.body;
    
    if (!name || !url) {
      return res.status(400).json({ error: 'Name and URL are required' });
    }
    
    try {
      new URL(url);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }
    
    const website = await prisma.website.create({
      data: {
        name,
        url,
        checkInterval,
        isActive: true
      }
    });
    
    await monitoringService.checkWebsite(website, prisma);
    
    res.status(201).json(website);
  } catch (error) {
    console.error('Error creating website:', error);
    res.status(500).json({ error: 'Failed to create website' });
  }
};

// Get all websites with status
exports.getAllWebsites = async (req, res) => {
  const { prisma } = req;
  try {
    const websites = await prisma.website.findMany({
      include: {
        statusChecks: {
          orderBy: { checkedAt: 'desc' },
          take: 1
        }
      }
    });
    
    const websitePromises = websites.map(async (website) => {
      const lastCheck = website.statusChecks[0] || null;
      const status = lastCheck ? statusUtils.determineStatus(lastCheck.status, lastCheck.responseTime) : 'offline';
      const uptime = await statusUtils.calculateUptime(website.id, prisma);
      
      return {
        id: website.id.toString(),
        name: website.name,
        url: website.url,
        status,
        uptime,
        responseTime: lastCheck ? lastCheck.responseTime : 0,
        lastChecked: lastCheck ? this.formatLastChecked(lastCheck.checkedAt) : 'Never'
      };
    });
    
    const formattedWebsites = await Promise.all(websitePromises);
    res.json(formattedWebsites);
  } catch (error) {
    console.error('Error fetching websites:', error);
    res.status(500).json({ error: 'Failed to fetch websites' });
  }
};

// Helper to format last checked time
exports.formatLastChecked = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

// Get a single website by ID
exports.getWebsiteById = async (req, res) => {
  const { prisma } = req;
  try {
    const { id } = req.params;
    
    const website = await prisma.website.findUnique({
      where: { id: Number(id) },
      include: {
        statusChecks: {
          orderBy: { checkedAt: 'desc' },
          take: 100
        }
      }
    });
    
    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }
    
    const uptime = await statusUtils.calculateUptime(website.id, prisma);
    const lastCheck = website.statusChecks[0] || null;
    const status = lastCheck ? statusUtils.determineStatus(lastCheck.status, lastCheck.responseTime) : 'offline';
    
    // Format metrics for response
    const responseTimeHistory = website.statusChecks.map(check => ({
      timestamp: check.checkedAt.toISOString(),
      value: check.responseTime
    }));
    
    const uptimeHistory = website.statusChecks.map(check => ({
      timestamp: check.checkedAt.toISOString(),
      status: check.status >= 200 && check.status < 300
    }));
    
    res.json({
      id: website.id.toString(),
      name: website.name,
      url: website.url,
      status,
      responseTime: lastCheck ? lastCheck.responseTime : 0,
      uptime,
      lastChecked: lastCheck ? this.formatLastChecked(lastCheck.checkedAt) : 'Never',
      metrics: {
        responseTime: responseTimeHistory,
        uptimeHistory
      }
    });
  } catch (error) {
    console.error('Error fetching website:', error);
    res.status(500).json({ error: 'Failed to fetch website' });
  }
};

// Update a website
exports.updateWebsite = async (req, res) => {
  const { prisma } = req;
  try {
    const { id } = req.params;
    const { name, url, checkInterval, isActive } = req.body;
    
    if (url) {
      try {
        new URL(url);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid URL format' });
      }
    }
    
    const updatedWebsite = await prisma.website.update({
      where: { id: Number(id) },
      data: {
        ...(name && { name }),
        ...(url && { url }),
        ...(checkInterval !== undefined && { checkInterval }),
        ...(isActive !== undefined && { isActive })
      }
    });
    
    res.json(updatedWebsite);
  } catch (error) {
    console.error('Error updating website:', error);
    res.status(500).json({ error: 'Failed to update website' });
  }
};

// Delete a website
exports.deleteWebsite = async (req, res) => {
  const { prisma } = req;
  try {
    const { id } = req.params;
    
    await prisma.statusCheck.deleteMany({ where: { websiteId: Number(id) } });
    await prisma.alert.deleteMany({ where: { websiteId: Number(id) } });
    await prisma.website.delete({ where: { id: Number(id) } });
    
    res.json({ message: 'Website deleted successfully' });
  } catch (error) {
    console.error('Error deleting website:', error);
    res.status(500).json({ error: 'Failed to delete website' });
  }
};

// Get website metrics
exports.getWebsiteMetrics = async (req, res) => {
  const { prisma } = req;
  try {
    const { id } = req.params;
    const { period = '24h' } = req.query;
    
    let hours = 24;
    if (period === '1h') hours = 1;
    else if (period === '7d') hours = 168;
    else if (period === '30d') hours = 720;
    
    const now = new Date();
    const startDate = new Date(now.getTime() - (hours * 60 * 60 * 1000));
    
    const statusChecks = await prisma.statusCheck.findMany({
      where: {
        websiteId: Number(id),
        checkedAt: { gte: startDate }
      },
      orderBy: { checkedAt: 'asc' }
    });
    
    const website = await prisma.website.findUnique({
      where: { id: Number(id) }
    });
    
    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }
    
    const metrics = {
      responseTime: statusChecks.map(check => ({
        timestamp: check.checkedAt.toISOString(),
        value: check.responseTime
      })),
      uptimeHistory: statusChecks.map(check => ({
        timestamp: check.checkedAt.toISOString(),
        status: check.status >= 200 && check.status < 300
      }))
    };
    
    res.json({
      id: id,
      name: website.name,
      ...metrics
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
};

// Get alerts
exports.getAlerts = async (req, res) => {
  const { prisma } = req;
  try {
    const alerts = await prisma.alert.findMany({
      orderBy: { createdAt: 'desc' },
      include: { website: true }
    });
    
    const formattedAlerts = alerts.map(alert => ({
      id: alert.id.toString(),
      websiteId: alert.websiteId.toString(),
      websiteName: alert.website.name,
      type: this.determineAlertType(alert.message),
      message: alert.message,
      severity: this.determineAlertSeverity(alert.message),
      timestamp: alert.createdAt.toISOString(),
      acknowledged: alert.isRead
    }));
    
    res.json(formattedAlerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
};

// Helper to determine alert type
exports.determineAlertType = (message) => {
  if (message.includes('down')) return 'downtime';
  if (message.includes('response time')) return 'performance';
  if (message.includes('error')) return 'error';
  if (message.includes('SSL') || message.includes('certificate')) return 'certificate';
  return 'info';
};

// Helper to determine alert severity
exports.determineAlertSeverity = (message) => {
  if (message.includes('down') || message.includes('error')) return 'critical';
  if (message.includes('response time') || message.includes('degraded')) return 'warning';
  return 'info';
};

// Get stats
exports.getStats = async (req, res) => {
  const { prisma } = req;
  try {
    const websites = await prisma.website.findMany({
      include: {
        statusChecks: {
          orderBy: { checkedAt: 'desc' },
          take: 1
        }
      }
    });
    
    const statusCounts = websites.reduce((acc, website) => {
      const lastCheck = website.statusChecks[0];
      const status = lastCheck ? 
        statusUtils.determineStatus(lastCheck.status, lastCheck.responseTime) : 
        'offline';
      
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    
    const activeAlerts = await prisma.alert.count({
      where: { isRead: false }
    });
    
    const responseTimes = websites.map(website => {
      const lastCheck = website.statusChecks[0];
      return lastCheck ? lastCheck.responseTime : 0;
    });
    
    const averageResponseTime = responseTimes.length > 0 ?
      Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length) :
      0;
    
    const uptimes = await Promise.all(
      websites.map(website => statusUtils.calculateUptime(website.id, prisma))
    );
    
    const averageUptime = uptimes.length > 0 ?
      parseFloat((uptimes.reduce((a, b) => a + b, 0) / uptimes.length).toFixed(2)) :
      0;
    
    res.json({
      totalWebsites: websites.length,
      websitesUp: statusCounts.online || 0,
      websitesDown: statusCounts.offline || 0,
      websitesDegraded: statusCounts.degraded || 0,
      activeAlerts,
      averageResponseTime,
      averageUptime
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};
exports.checkWebsite = async (req, res) => {
  const { prisma } = req;
  try {
    const { id } = req.params;
    const website = await prisma.website.findUnique({
      where: { id: Number(id) }
    });
    
    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }
    
    await monitoringService.checkWebsite(website, prisma);
    res.json({ message: 'Website check initiated' });
  } catch (error) {
    console.error('Error checking website:', error);
    res.status(500).json({ error: 'Failed to check website' });
  }
};

exports.getWebsiteHistory = async (req, res) => {
  const { prisma } = req;
  try {
    const { id } = req.params;
    const history = await prisma.statusCheck.findMany({
      where: { websiteId: Number(id) },
      orderBy: { checkedAt: 'desc' },
      take: 100
    });
    
    res.json(history);
  } catch (error) {
    console.error('Error fetching website history:', error);
    res.status(500).json({ error: 'Failed to fetch website history' });
  }
};