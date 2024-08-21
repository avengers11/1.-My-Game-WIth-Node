const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const app = express();
const server = http.createServer(app);
const session = require('express-session');
const flash = require('connect-flash');

// Session configuration
app.use(session({
    secret: 'your-secret-key', // Replace with a strong secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

app.use(flash());

// static file path 
app.use(express.static(path.join(__dirname, 'public')));

// Set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'resource/views'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
const JiliLusoService = require('./service/JiliLudoService');
const ludoRoutes = require('./routes/ludo');
app.use('/ludo', ludoRoutes);
JiliLusoService(io);
/*
===========================
    Ludo Game END
===========================
*/


/*
===========================
    Ludo Game Start
===========================
*/
const admin = require('./routes/admin');
app.use('/admin', admin);
/*
===========================
    Ludo Game END
===========================
*/


app.get('/', (req, res) => {
    res.render('games/index');
});
server.listen(3000, () => {
    console.log('Server listening on port 3000');
});
