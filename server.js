import dotenv from 'dotenv';
dotenv.config();

import app from "./src/config/server.config.js";
import connectDB from "./src/config/db.config.js";

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto: ${process.env.PORT}`);
    });
});