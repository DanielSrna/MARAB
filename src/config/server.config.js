
import express from 'express';
import adminUserRoutes from '../routes/adminUser.route.js';


const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({ message: "Server is running" });
});

// Rutas de usuario
app.use('/api/auth', adminUserRoutes);

export default app;