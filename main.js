const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const app = express();
const server = http.createServer(app);
const session = require('express-session');
const flash = require('connect-flash');
require('dotenv').config();

// Session configuration
app.use(session({
    secret: 'D6TSRSG52HS7',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use(flash());

// **CORS Middleware comes before serving static files**
app.use(cors({
    origin: process.env.FRONTEND_URL
}));

// Serve static files after CORS middleware
app.use(express.static(path.join(__dirname, 'public')));

// Set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'resource/views'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up Socket.io with CORS options
const io = socketIo(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
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
// const JiliFishService = require('./service/JiliFishService');
// const jiliFishRoutes = require('./routes/JiliFish');
// app.use('/jili-fish', jiliFishRoutes);
// JiliFishService(io);
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
// const JiliLusoService = require('./service/JiliLudoService');
// const ludoRoutes = require('./routes/ludo');
// app.use('/ludo', ludoRoutes);
// JiliLusoService(io);
/*
===========================
    Ludo Game END
===========================
*/

/*
===========================
    GREADY PANEL Start
===========================
*/
const GreadyService = require('./service/GreadyService');
const GreadyRoutes = require('./routes/gready');
app.use('/gready', GreadyRoutes);
GreadyService(io);
/*
===========================
    GREADY PANEL END
===========================
*/

/*
===========================
    ADMIN PANEL Start
===========================
*/
const admin = require('./routes/admin');
app.use('/admin', admin);
/*
===========================
    ADMIN PANEL END
===========================
*/

app.get('/', (req, res) => {
    res.render('games/index');
});

server.listen(3001, () => {
    console.log('Server listening on port 3001');
});
