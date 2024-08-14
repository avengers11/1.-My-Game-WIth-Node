const socketIo = require('socket.io');

// Initialize Socket.io namespace and setup
function setupSocket(io) {
    const jiliFish = io.of('jili-fish');

    let timer = 30;
    function startTimer() {
        setInterval(() => {
            if (timer > 0) {
                timer--;
            } else {
                timer = 30;
            }
            jiliFish.emit('timerUpdate', timer);
        }, 1000);
    }
    startTimer();

    var userBets = [];
    jiliFish.on('connection', (socket) => {
        var totalMember = jiliFish.sockets.size;

        // users bet 
        socket.on("betInsert", function(data){
            userBets.push(data);
            console.log(userBets);
        });

        // Send the current timer value to the newly connected client
        socket.emit('timerUpdate', timer);

        socket.on('disconnect', () => {
            // Handle disconnection if needed
        });
    });
}

module.exports = setupSocket;
