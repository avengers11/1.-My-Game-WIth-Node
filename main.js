const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const app = express();
const server = http.createServer(app);

// static file path 
app.use(express.static(path.join(__dirname, 'public')));

// Set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'resource/views'));
app.use(express.json());

// Set up Socket.io with CORS options
const io = socketIo(server, {
    cors: {
        origin: "http://localhost", // Your frontend URL
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});


/*
===========================
    Fish Games Start
===========================
*/
const JiliFishService = require('./service/JiliFishService');
const jiliFishRoutes = require('./routes/JiliFish');
app.use('/jili-fish', jiliFishRoutes);
JiliFishService(io);
/*
===========================
    Fish Games END
===========================
*/


/*
===========================
    Ludo Game Start
===========================
*/
const ludoRoutes = require('./routes/ludo');
app.use('/lodu', ludoRoutes);
/*
===========================
    Ludo Game END
===========================
*/

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});
