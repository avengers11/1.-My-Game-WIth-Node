const socketIo = require('socket.io');
const {ludoManage} = require('../service/global');
const { User, Ludo_Board_Data, Ludo_Bet_Insert } = require('../models');

// Initialize Socket.io namespace and setup
function setupSocket(io) {
    const JiliLudo = io.of('jili-ludo');
    
    var thisBoardAmount = []; //[ { amount: 500, board: 1 }, { amount: 500, board: 1 }, { amount: 500, board: 1 } ]
    var userBetsLudo = [];
    var userBetsWinnerLudo = [];
    var thisBoardWinner = [];
    var allActiveUsers = [];
    var latestFiftyWinner = [];
    var boardId = Number(new Date().getTime()/1000).toFixed(0);

    let timer = 5;
    async function startTimer() {
        // Update global ludoManage
        
        const { dataValues: { game_mod, game_status, next_win, dice_1x, dice_2x, dice_3x, change_low, change_high} } = await ludoManage;

        setInterval(() => {
            // reset 
            if(timer == 16){
                thisBoardAmount = [];
                userBetsLudo = [];
                userBetsWinnerLudo = [];
            }

            if (timer > 0) {
                timer--;
            } else {
                boardId = Number(new Date().getTime()/1000).toFixed(0);
                
                // check game status
                if(!game_status){
                    return false;
                }
                // game run mod 
                if(game_mod){ //auto
                    thisBoardWinner = winningProcess(dice_1x, dice_2x, dice_3x, change_low, change_high);
                }else{ //menual 
                }

                // Rewards
                winnerRewards();

                // // board insert 
                // boardInsert(boardId, thisBoardWinner.boardNumber);

                // latest 20 winners 
                latestFiftyWinner.unshift({
                    winner: thisBoardWinner.winner,
                    number_winner: thisBoardWinner.number_winner
                });
                if(latestFiftyWinner.length > 20){
                    latestFiftyWinner.pop();
                }

                
                JiliLudo.emit('ludoWinner',  {thisBoardWinner, userBetsWinnerLudo, latestFiftyWinner});

                // time reset
                timer = 30;
            }
            // socket connect 
            JiliLudo.emit('timerUpdateLudo',  {timer});
        }, 1000);
    }
    startTimer();

    // winning process 
    function winningProcess(dice_1x, dice_2x, dice_3x, change_low, change_high) {
        const random = Math.floor(Math.random() * 1000) + 1;
        const isLow = random < change_low;
        
        let boardNumber = determineBoardNumber(thisBoardAmount, isLow);
        let lowValue = boardNumber === 3 ? 11 : 3;
        let highValue = boardNumber === 3 ? 18 : 10;
    
        // If random is within the range for board 2, set board number to 2
        if (random > dice_2x && random <= dice_3x) {
            boardNumber = 2;
        }
    
        // Determine if the outcome should be a double or triple win
        const isDouble = random > dice_1x && random <= dice_2x;
        const isTriple = random > dice_2x && random <= dice_3x;
    
        return winningNumber(lowValue, highValue, isDouble, isTriple, boardNumber);
    }
    function determineBoardNumber(thisBoardAmount, isLow) {
        if (thisBoardAmount.length === 0) {
            return Math.random() < 0.5 ? 1 : 3;
        }
    
        // Get the amounts for board 1 and board 3
        const board1Amount = thisBoardAmount.find(item => item.board === 1)?.amount;
        const board3Amount = thisBoardAmount.find(item => item.board === 3)?.amount;
        if (board1Amount === board3Amount) {
            return Math.random() < 0.5 ? 1 : 3;
        }
    
        // Initialize the selected board with the first board in the array
        let selectedBoard = thisBoardAmount[0];
    
        // Iterate through each board to find the board with the desired amount
        thisBoardAmount.forEach(currentBoard => {
            const shouldReplace = isLow ? currentBoard.amount < selectedBoard.amount : currentBoard.amount > selectedBoard.amount;
            if (shouldReplace) {
                selectedBoard = currentBoard;
            }
        });
    
        // Return the board number of the selected board
        return selectedBoard.board;
    }
    function winningNumber(minSum, maxSum, isDuble = false, isThree = false, boardNumber) {
        const numbers = [1, 2, 3, 4, 5, 6];
        let result = [];
        let sum = 0;
    
        while (true) {
            result = [];
            sum = 0;
    
            if (isThree) {
                const threeNumber = numbers[Math.floor(Math.random() * numbers.length)];
                result = [threeNumber, threeNumber, threeNumber];
                sum = threeNumber * 3;
            } else if (isDuble) {
                const dubleNumber = numbers[Math.floor(Math.random() * numbers.length)];
                let secondNumber;
                do {
                    secondNumber = numbers[Math.floor(Math.random() * numbers.length)];
                } while (secondNumber === dubleNumber);
    
                result = [dubleNumber, dubleNumber, secondNumber];
                sum = dubleNumber * 2 + secondNumber;
            } else {
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
            "duble": dubleNumber, // null OR 1-6
            "three": threeNumber, // null OR 1-6
            "boardNumber" : boardNumber // 1-3
        };
    }

    // winnerRewards
    function winnerRewards() {
        userBetsLudo.forEach(element => {
            if(thisBoardWinner.winner3 != null){
                if(element.board == thisBoardWinner.boardNumber){
                    betInsert(element.userId, element.amount * 14);
                    userBetsWinnerLudo.push({
                        amount: element.amount * 15,
                        board: element.board,
                        myName: element.myName,
                        myImg: element.myImg,
                        userId: element.userId
                    });
                }
            }else if([1, 3].includes(thisBoardWinner.boardNumber)){
                if(element.board == thisBoardWinner.boardNumber){
                    betInsert(element.userId, element.amount * 2);
                    userBetsWinnerLudo.push({
                        amount: element.amount * 2,
                        board: element.board,
                        myName: element.myName,
                        myImg: element.myImg,
                        userId: element.userId
                    });
                }else{
                }
            }
        });
    }
    
    // bet insert 
    async function betInsert(userID, amount) {
        try {
            const user = await User.findByPk(userID);
            if (user) {
                user.amount += amount;
                await user.save();
            }
        } catch (error) {
        }
        
    }

    // board insert 
    async function boardInsert(board_id, boardNumber) {
        await Ludo_Board_Data.create({ board_id, board_number: boardNumber, status: false });
    }

    JiliLudo.on('connection', (socket) => {
        var totalMember = JiliLudo.sockets.size;

        // active users 
        socket.on("ludoActiveUsersConnect", (data) => {
            data['id'] = socket.id;
            allActiveUsers.push(data);
            JiliLudo.emit("ludoActiveUsersShow", {allActiveUsers, thisBoardWinner, userBetsWinnerLudo, latestFiftyWinner});
        });

        // users bet 
        socket.on("ludoBetInsert", function(event) {
            let boardInt = Number(event.user.board);
            let amountInt = Number(event.user.amount);
            let myName = event.user.myName;
            let myImg = event.user.myImg;
            let userId = Number(event.user.myId);

            // check index for users 
            const existingBetIndex = userBetsLudo.findIndex(
                bet => bet.board === boardInt && bet.userId === userId
            );
            if (existingBetIndex !== -1) {
                userBetsLudo[existingBetIndex].amount = parseFloat(userBetsLudo[existingBetIndex].amount) + parseFloat(amountInt);
            } else {
                userBetsLudo.push({
                    amount: amountInt,
                    board: boardInt,
                    myName: myName,
                    myImg: myImg,
                    userId: userId
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

            // Ludo_Bet_Insert.create({ user_id: userId, board_id: boardId,  amount: amountInt, board_number: boardInt});

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
