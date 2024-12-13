import express from "express";
import { StatusCodes } from "http-status-codes";
import { PORT } from "./config/serverConfig.js";
import connectionDB from "./config/dbConfig.js";
import apiRouter from './router/apiRoutes.js'
import { isAuthenticated } from "./middleware/authMiddleware.js";
import mailer from './config/mailConfig.js';


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use('/api',apiRouter);

app.get('/ping',isAuthenticated, (req, res) => {
    return res.status(StatusCodes.OK).json({ message: 'pong' })
})

app.listen(PORT, async () => {
    console.log(`server is running at ${PORT}`);
    connectionDB();
    const mailResponse = await mailer.sendMail({
        from: 'abhijitdinda228@gmail.com',
        to: 'abhijit.runtime@gmail.com',
        subject: "Hello ✔",
        text: "Hello world?",
        html: "<b>Hello world?</b>",
    });

    console.log(mailResponse);
})