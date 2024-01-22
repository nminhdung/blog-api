import express from 'express';
import dotenv from "dotenv"
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { dbConnect } from "./config/dbConnect.js"
import { initRoutes } from "./routes/index.js"

dotenv.config();
const app = express();
app.use(cors({
    origin: [process.env.URL_CLIENT],
    credentials: true,
    method: ["POST", "PUT", "GET", "DELETE"],
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
dbConnect();
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
initRoutes(app);