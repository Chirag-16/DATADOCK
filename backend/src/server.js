const { app, prisma } = require('./app');
const cron = require('node-cron');
const monitoringService = require('./services/monitoringService');

const PORT = process.env.PORT || 5001;

// Schedule monitoring
function scheduleMonitoring() {
  cron.schedule('* * * * *', async () => {
    try {
      await monitoringService.runScheduledChecks(prisma);
    } catch (error) {
      console.error('Error in monitoring cron job:', error);
    }
  });
}

// Start the server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  scheduleMonitoring();
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});