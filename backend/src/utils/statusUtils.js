// // Constants for status
// const STATUS = {
//   ONLINE: 'online',
//   DEGRADED: 'degraded',
//   OFFLINE: 'offline'
// };

// // Determine website status based on response time and HTTP status
// exports.determineStatus = (statusCode, responseTime) => {
//   // If no response or error status code
//   if (statusCode === 0 || statusCode >= 500) {
//     return STATUS.OFFLINE;
//   }
  
//   // If slow response (over 1000ms) or non-200 status
//   if (responseTime > 1000 || (statusCode >= 400 && statusCode < 500)) {
//     return STATUS.DEGRADED;
//   }
  
//   // Otherwise online
//   return STATUS.ONLINE;
// };

// // Calculate uptime percentage based on historical checks
// exports.calculateUptime = async (websiteId, prisma) => {
//   const statusChecks = await prisma.statusCheck.findMany({
//     where: { websiteId: Number(websiteId) },
//     orderBy: { checkedAt: 'desc' },
//     take: 100 // Last 100 checks for calculation
//   });
  
//   if (statusChecks.length === 0) return 0;
  
//   let successfulChecks = 0;
//   statusChecks.forEach(check => {
//     if (check.status >= 200 && check.status < 300) {
//       successfulChecks++;
//     }
//   });
  
//   const uptimePercentage = (successfulChecks / statusChecks.length) * 100;
//   return parseFloat(uptimePercentage.toFixed(2));
// };

// Constants for status
const STATUS = {
  ONLINE: 'online',
  DEGRADED: 'degraded',
  OFFLINE: 'offline'
};

// Determine website status based on response time and HTTP status
exports.determineStatus = (statusCode, responseTime) => {
  if (statusCode === 0 || statusCode >= 500) {
    return STATUS.OFFLINE;
  }
  
  if (responseTime > 1000 || (statusCode >= 400 && statusCode < 500)) {
    return STATUS.DEGRADED;
  }
  
  return STATUS.ONLINE;
};

// Calculate uptime percentage based on historical checks
exports.calculateUptime = async (websiteId, prisma) => {
  const statusChecks = await prisma.statusCheck.findMany({
    where: { websiteId: Number(websiteId) },
    orderBy: { checkedAt: 'desc' },
    take: 100
  });
  
  if (statusChecks.length === 0) return 0;
  
  let successfulChecks = 0;
  statusChecks.forEach(check => {
    if (check.status >= 200 && check.status < 300) {
      successfulChecks++;
    }
  });
  
  const uptimePercentage = (successfulChecks / statusChecks.length) * 100;
  return parseFloat(uptimePercentage.toFixed(2));
};