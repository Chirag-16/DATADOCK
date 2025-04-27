// const express = require('express');
// const cors = require('cors');
// const { PrismaClient } = require('@prisma/client');
// const websiteRoutes = require('./routes/websiteRoutes');

// const app = express();
// const prisma = new PrismaClient();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Add Prisma to request
// app.use((req, res, next) => {
//   req.prisma = prisma;
//   next();
// });

// // Routes
// app.use('/api', websiteRoutes);

// // Health check
// app.get('/health', (req, res) => {
//   res.json({ status: 'ok' });
// });

// module.exports = { app, prisma };  

const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const websiteRoutes = require('./routes/websiteRoutes');

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors({
  origin: '*'
}));
app.use(express.json());

// Add Prisma to request
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

// Routes
app.use('/api', websiteRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = { app, prisma };