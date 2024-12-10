import express from "express";
import { StatusCodes } from "http-status-codes";
import { PORT } from "./config/serverConfig.js";
import connectionDB from "./config/dbConfig.js";
import apiRouter from './router/apiRoutes.js'
import { isAuthenticated } from "./middleware/authMiddleware.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use('/api',apiRouter);

app.get('/ping',isAuthenticated, (req, res) => {
    return res.status(StatusCodes.OK).json({ message: 'pong' })
})

app.listen(PORT, () => {
    console.log(`server is running at ${PORT}`);
    connectionDB();
})