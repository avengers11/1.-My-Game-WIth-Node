const socketIo = require('socket.io');
const {ludoManage, winerData} = require('./global');
const { User } = require('../models');

// Initialize Socket.io namespace and setup
function setupSocket(io) {
    const JiliLudo = io.of('jili-ludo');
    var thisBoardAmount = [];
    var userBetsLudo = [];
    var thisBoardWinner = [];
    var allActiveUsers = [];


    let timer = 5;
    async function startTimer() {
        const { dataValues: { game_mod, game_status, change_2, change_3, change_high, change_low} } = await ludoManage;

        let boardId = Number(new Date().getTime()/1000).toFixed(0);
        setInterval(() => {
            if (timer > 0) {
                timer--;
            } else {
                // check game status
                if(!game_mod){
                    return false;
                }
                // game run mod 
                if(game_status){ //auto
                    var random = Math.floor(Math.random() * 1000) + 1;

                    const low = random > change_3 && random <= change_low ? true : false;
                    var boardNumber = thisBoardAmount.length > 0 
                        ? (() => {
                            const board1Amount = thisBoardAmount.find(item => item.board === 1)?.amount;
                            const board3Amount = thisBoardAmount.find(item => item.board === 3)?.amount;
                            if (board1Amount === board3Amount) {
                                return Math.random() < 0.5 ? 1 : 3;
                            }
                            return thisBoardAmount.reduce((prev, curr) => 
                                low ? (curr.amount < prev.amount ? curr : prev) : (curr.amount > prev.amount ? curr : prev)
                            ).board;
                        })() 
                        : Math.random() < 0.5 ? 1 : 3;
                    // low & high number 
                    var low_value = 3;
                    var high_value = 10;
                    if(boardNumber == 3){
                        low_value = 11;
                        high_value = 18;
                    }

                    // check 2 win 
                    var winner_result = "";
                    var winner2 = null;
                    var winner3 = null;

                    if(random <= change_2){
                        winner_result = getRandomNumbers(low_value, high_value, true, false);
                        winner2 = `${winner_result.duble}`;
                    }else if(random > change_2 && random <= change_3){
                        winner_result = getRandomNumbers(low_value, high_value, false, true);
                        boardNumber = 2;
                        winner3 = `${winner_result.three}`;
                    }else{
                        winner_result = getRandomNumbers(low_value, high_value, false, false);
                    }

                    thisBoardWinner = {winner_result, boardNumber, winner3, winner2};
                }else{ //menual 
                    getRandomNumbers(low_value, high_value, false, false);
                }

                // socket connect
                userBetsLudo.forEach(element => {
                    let winningX = 0;
                    if(thisBoardWinner.winner2 != null){
                        winningX = 10;
                        if([10, 11, 12, 13, 14, 15].includes(element.board)){
                            betInsert(element.userId, element.amount * winningX);
                        }
                    }else if(thisBoardWinner.winner3 != null){
                        if([10, 11, 12, 13, 14, 15].includes(element.board)){
                            winningX = 200;
                            betInsert(element.userId, element.amount * winningX);
                        }
                    }else if([1, 3].includes(thisBoardWinner.boardNumber)){
                        if(element.board == thisBoardWinner.boardNumber){
                            winningX = 2;
                            betInsert(element.userId, element.amount * winningX);
                        }
                    }
                });
                
                // reset bet
                thisBoardAmount = [];
                userBetsLudo = [];
                JiliLudo.emit('ludoWinner',  thisBoardWinner);
                // time reset
                timer = 30;
            }
            // socket connect 
            JiliLudo.emit('timerUpdateLudo',  {timer, boardId, thisBoardWinner});
        }, 1000);
    }
    startTimer();

    // bet insert 
    async function betInsert(userID, amount) {
        try {
            const user = await User.findByPk(userID);
            if (user) {
                user.amount += amount;
                await user.save();
                console.log('User amount updated successfully:', user.amount);
            } else {
                console.log('User not found');
            }
        } catch (error) {
            console.error('Error updating user amount:', error);
        }
        
    }

    // make small items 
    function getRandomNumbers(minSum, maxSum, isDuble = false, isThree = false) {
        const numbers = [1, 2, 3, 4, 5, 6];
        let result = [];
        let sum = 0;
    
        while (true) {
            result = [];
            sum = 0;
    
            if (isThree) {
                // If 'isThree' is true, pick a random number and repeat it three times
                const threeNumber = numbers[Math.floor(Math.random() * numbers.length)];
                result = [threeNumber, threeNumber, threeNumber];
                sum = threeNumber * 3;
            } else if (isDuble) {
                // If 'isDuble' is true, pick two random numbers, one of them repeated
                const dubleNumber = numbers[Math.floor(Math.random() * numbers.length)];
                let secondNumber;
                do {
                    secondNumber = numbers[Math.floor(Math.random() * numbers.length)];
                } while (secondNumber === dubleNumber);
    
                result = [dubleNumber, dubleNumber, secondNumber];
                sum = dubleNumber * 2 + secondNumber;
            } else {
                // Otherwise, pick three random numbers
                for (let i = 0; i < 3; i++) {
                    const randomIndex = Math.floor(Math.random() * numbers.length);
                    const selectedNumber = numbers[randomIndex];
                    result.push(selectedNumber);
                    sum += selectedNumber;
                }
            }
    
            if (sum >= minSum && sum <= maxSum) {
                break;
            }
        }
    
        let dubleNumber = null;
        let threeNumber = null;
    
        // Check for duplicates and triplets
        const countMap = result.reduce((acc, num) => {
            acc[num] = (acc[num] || 0) + 1;
            return acc;
        }, {});
    
        for (let num in countMap) {
            if (countMap[num] === 2) {
                dubleNumber = parseInt(num);
            } else if (countMap[num] === 3) {
                threeNumber = parseInt(num);
            }
        }
    
        return {
            "winner": result, // e.g., [1, 2, 3]
            "number_winner": sum, // Sum of all items in the result array
            "duble": dubleNumber,
            "three": threeNumber
        };
    }

    // amountCalculation
    function amountCalculation(userId, amount) {
        console.log(`The user ${userId} lose ${amount}`);
    }
    
    JiliLudo.on('connection', (socket) => {
        var totalMember = JiliLudo.sockets.size;

        socket.on("ludoActiveUsersConnect", (data) => {
            data['id'] = socket.id;
            allActiveUsers.push(data);
            JiliLudo.emit("ludoActiveUsersShow", allActiveUsers);
        });

        // users bet 
        socket.on("ludoBetInsert", function(event) {
            let boardInt = Number(event.user.board);
            let amountInt = Number(event.user.amount);
            let userId = Number(event.user.userId);

            // check index for users 
            const existingBetIndex = userBetsLudo.findIndex(
                bet => bet.board === boardInt && bet.userId === event.user.userId
            );
            if (existingBetIndex !== -1) {
                userBetsLudo[existingBetIndex].amount = parseFloat(userBetsLudo[existingBetIndex].amount) + parseFloat(amountInt);
            } else {
                userBetsLudo.push({
                    amount: parseFloat(amountInt),
                    board: boardInt,
                    userId: event.user.userId
                });
            }

            // check index for winner 
            if([1, 3].includes(boardInt)){
                const existingBetIndexWinner = thisBoardAmount.findIndex(
                    bet => bet.board === boardInt
                );
                if (existingBetIndexWinner !== -1) {
                    thisBoardAmount[existingBetIndexWinner].amount = parseFloat(thisBoardAmount[existingBetIndexWinner].amount) + parseFloat(amountInt);
                } else {
                    thisBoardAmount.push({
                        amount: parseFloat(amountInt),
                        board: boardInt,
                    });
                }
            }
            
            betInsert(userId, -amountInt);

            // Show coin 
            JiliLudo.emit('ludoBetShow', event.coin);
        });
        

        socket.on('disconnect', () => {
            const index = allActiveUsers.findIndex(user => user.id === socket.id);
            if (index !== -1) {
                allActiveUsers.splice(index, 1);
                JiliLudo.emit('ludoActiveUsersShow', allActiveUsers);
            }
        });
    });
}

module.exports = setupSocket;
