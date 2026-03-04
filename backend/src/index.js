import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/db.js';
import authRoutes from './routes/auth.js';
import analysisRoutes from './routes/analysis.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// root test route
app.get('/', (req, res) => {
  res.send('KrishiShield Backend API is running 🚀');
});

app.use('/api/auth', authRoutes);
app.use('/api', analysisRoutes);

const PORT = process.env.PORT || 5000;

(async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    await sequelize.sync({ alter: true });

    app.listen(PORT, () => {
      console.log(`🚀 Server listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Unable to start server', err);
  }
})();