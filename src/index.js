import express from "express";
import { StatusCodes } from "http-status-codes";
import { PORT } from "./config/serverConfig.js";
import connectionDB from "./config/dbConfig.js";
import apiRouter from './router/apiRoutes.js'
import { isAuthenticated } from "./middleware/authMiddleware.js";
import mailer from './config/mailConfig.js';
import { Server } from 'socket.io';
import { createServer } from 'http';
import messageSocketHandlers from "./controller/messageSocketController.js";
import channelSocketHandlers from "./controller/channelSocketController.js";

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use('/api',apiRouter);

app.get('/ping',isAuthenticated, (req, res) => {
    return res.status(StatusCodes.OK).json({ message: 'pong' })
})

io.on('connection', (socket) => {
    messageSocketHandlers(io, socket);
    channelSocketHandlers(io, socket);
});  

server.listen(PORT, async () => {
    console.log(`server is running at ${PORT}`);
    connectionDB();
    // const mailResponse = await mailer.sendMail({
    //     from: 'anitesh.runtime@gmail.com',
    //     to: 'abhijit.runtime@gmail.com',
    //     subject: "Hello ✔",
    //     text: "Hello world?",
    //     html: "<b>Hello world?</b>",
    // }); 

    // console.log(mailResponse);
})

