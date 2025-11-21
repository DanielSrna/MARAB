
import express from 'express';
import cors from 'cors';
import adminUserRoutes from '../routes/adminUser.route.js';


const app = express();

// Configuración de CORS
const corsOptions = {
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({ message: "Server is running" });
});

// Rutas de usuario
app.use('/api/auth', adminUserRoutes);

export default app;