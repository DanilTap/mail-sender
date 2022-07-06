const express = require("express");
const createServer = require("http");
const Server = require("socket.io");
const nodemailer = require('nodemailer');

// Server
const app = express();
const httpServer = createServer.createServer(app);
const io = new Server.Server(httpServer, {});


// Mail
var transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: {
        user: '',
        pass: ''
    }
})


app.get('/', function(req, res) {
    app.use(express.static(__dirname + "/site"));
});


io.on("connection", (socket) => {
    console.log(`Connected ${socket.id}!`);

    socket.on("start_sending", (data) => {
        socket.emit("sending_done", {stats: true});
        transporter = nodemailer.createTransport({
            host: 'smtp.mail.ru',
            port: 465,
            secure: true,
            auth: {
                user: data.account[0],
                pass: data.account[1]
            }
        });

        transporter.sendMail({
            from: `"${data.account[0]}" <${data.account[0]}>`,
            to: data.addrs,
            html: data.text
        });
    });
});

httpServer.listen(3000, () => console.log('Server ready!'));