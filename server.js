import express from 'express';
import dotenv from "dotenv"
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { dbConnect } from "./config/dbConnect.js";
import { initRoutes } from "./routes/index.js";
import path from 'path'


dotenv.config();
const __dirname = path.resolve();
const app = express();
app.use(cors({
    origin: [process.env.URL_CLIENT, "https://blog-ui-lilac.vercel.app"],
    credentials: true,
    method: ["POST", "PUT", "GET", "DELETE"],
    exposedHeaders: ["set-cookie"],
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
dbConnect();
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
initRoutes(app);
app.use(express.static(path.join(__dirname, '/client/dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});