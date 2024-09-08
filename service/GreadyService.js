const { User } = require('../models');
const { GreadyManage, refreshGreadyManage } = require('../service/global');

// Initialize Socket.io namespace and setup
async function setupSocket(io) {
    const greadyIo = io.of('gready');
    var greadyManageDataValues = await GreadyManage();

    var allActiveUsers = [];
    var winnersFruits = [];

    // betting related 
    var battingUsersUndersThisBoard = [];
    var allAmountUndersThisBoard = [{ amount: 0, board: 1 },{ amount: 0, board: 8 },{ amount: 0, board: 7 },{ amount: 0, board: 6 }];
    var winnerUsersUndersThisBoard = [];

    let timer = 20;
    async function startTimer() {
        
        
        setInterval(async () => {
            if (timer > 0) {
                timer--;
            } else {
                timer = 20;

                // winning process 
                const winners = await winningProcess();
                
                // rewards proccess 
                const rewardUsers = rewardsProcess(winners);
                
                greadyIo.emit('greadyWinnersData',  {winners, winnersFruits, rewardUsers});
            }

            console.log("gready: " + timer);
            

            greadyIo.emit('greadyTimerUpdate', {timer});
        }, 1000);
    }
    startTimer();

    // winningProcess
    await winningProcess();
    async function winningProcess() {
        greadyManageDataValues = await GreadyManage();
        const randomNumber = Math.floor(Math.random() * 1000) + 1;
        const randomNumber2 = Math.floor(Math.random() * 1000) + 1;

        // check mode 
        let calculationBoardNumber = "";
        if(greadyManageDataValues.game_mod == 0){
            calculationBoardNumber = Number(greadyManageDataValues.next_win);
        }else{
            // calculationBoardNumber = Math.floor(Math.random() * 8);
            if(randomNumber > greadyManageDataValues.win5x &&  randomNumber <= greadyManageDataValues.win10x){
                calculationBoardNumber = 2;
            }else if(randomNumber > greadyManageDataValues.win10x &&  randomNumber <= greadyManageDataValues.win15x ){
                calculationBoardNumber = 3;
            }else if(randomNumber > greadyManageDataValues.win15x &&  randomNumber <= greadyManageDataValues.win25x){
                calculationBoardNumber = 4;
            }else if(randomNumber > greadyManageDataValues.win25x  &&  randomNumber <= greadyManageDataValues.win45x){
                calculationBoardNumber = 5;
            }else{
                let allEqual = allAmountUndersThisBoard.every(item => item.amount === allAmountUndersThisBoard[0].amount);
                if (allEqual) {
                    const data = new Set([1, 8, 7, 6]);
                    const array = Array.from(data);
                    const randomItem = array[Math.floor(Math.random() * array.length)];
                    calculationBoardNumber = randomItem;
                } else {
                    // Step 1: Sort the array by the 'board' property
                    allAmountUndersThisBoard.sort((a, b) => a.amount - b.amount);
                    let minBoard = allAmountUndersThisBoard[0].board;
                    let midBoard = allAmountUndersThisBoard[Math.floor(allAmountUndersThisBoard.length / 2)].board;
                    let maxBoard = allAmountUndersThisBoard[allAmountUndersThisBoard.length - 1].board;
                    if(greadyManageDataValues.change_low <= randomNumber2){
                        calculationBoardNumber = minBoard;
                    }else if(randomNumber2 > greadyManageDataValues.change_low &&  randomNumber2 <= greadyManageDataValues.change_mid){
                        calculationBoardNumber = midBoard;
                    }else{
                        calculationBoardNumber = maxBoard;
                    }
                }
            }
        }

        const boardNumber = {
            "1.26": 1,
            "1.24": 2,
            "1.01": 3,
            "1.04": 4,
            "0.48": 5,
            "0.51": 6,
            "0.55": 7,
            "0.58": 8
        };
        const randomKey = Object.keys(boardNumber)[Number(calculationBoardNumber-1)];        
        const randomValue = boardNumber[randomKey];

        // winRates
        const winRates = {
            1: 5,
            2: 10,
            3: 15,
            4: 25,
            6: 5,
            7: 5,
            8: 5,
            default: 45
        };
        const winRate = winRates[randomValue] || winRates.default;
    
        // Update winnersFruits
        winnersFruits.unshift(randomValue);
        if (winnersFruits.length > 20) {
            winnersFruits.pop();
        }

        console.log({
            "calculationBoardNumber": calculationBoardNumber,
            "randomKey": randomKey,
            "randomValue": randomValue,
            "winRate": winRate,
            "randomNumber": randomNumber,
            "randomNumber2": randomNumber2,
        });
    
        return {
            frame: randomKey,
            board: randomValue,
            winRate: winRate
        };
    }
    

    // rewardsProcess
    function rewardsProcess(winners) {
        winnerUsersUndersThisBoard = [];
        battingUsersUndersThisBoard.forEach((curE) => {
            if (curE.board === winners.board) {
                let winAmount = curE.amount * winners.winRate;
                winnerUsersUndersThisBoard.push({
                    "amount": curE.amount,
                    "win": winAmount,
                    "board": curE.board,
                    "name": curE.name,
                    "image": curE.image,
                    "userId": curE.userId
                });

                // cal 
                betsCalculation(curE.userId, winAmount);
            }
        });
    
        // Reset old data
        battingUsersUndersThisBoard = [];
        allAmountUndersThisBoard = [{ amount: 0, board: 1 },{ amount: 0, board: 8 },{ amount: 0, board: 7 },{ amount: 0, board: 6 }];
        winnerUsersUndersThisBoard.sort((a, b) => b.amount - a.amount);
    
        return winnerUsersUndersThisBoard.slice(0, 3);
    }
    
    // betsCalculation
    async  function betsCalculation(userId, amount) {
        try {
            const user = await User.findByPk(userId);
            user.amount = user.amount + amount;
            await user.save();
        } catch (error) {
            console.error('Error fetching user:', error);
            return false;
        }
    }

    // getUserInfo
    async  function getUserInfo(userId) {
        // try {
        //     const user = await User.findByPk(userId);
        //     console.log(user);
        // } catch (error) {
        //     console.error('Error fetching user:', error);
        //     return false;
        // }
    }


    // manageDataOnConnect 
    greadyIo.on("greadyManageDataUpdate", (data) => {
        console.log(data);
    });

    // socket on connect 
    greadyIo.on('connection', (socket) => {
        // active users 
        socket.on("greadyActiveUsersConnect", (data) => {
            var userAmount = data.userAmount;
            var userName = data.userName;
            var userImage = data.userImg;
            var userId = data.userId;

            var userData = {
                userAmount,
                userName,
                userImage,
                userId,
                "socket_id": socket.id
            };

            // submit user 
            allActiveUsers.push(userData);
            const remainingSlots = 5 - allActiveUsers.length;
            for (let i = 0; i < remainingSlots; i++) {
                allActiveUsers.push({
                    "userAmount": 0,
                    "board": 1,
                    "userName": "NO ONE WIN",
                    "userImage": "http://localhost:3000/assets/general/no-users.jpg",
                    "userId": 1,
                    "socket_id": 'testing',
                });
            }
            allActiveUsers.sort((a, b) => b.userAmount - a.userAmount);
            console.log(allActiveUsers);

            greadyIo.emit("greadyActiveUsersShow", {allActiveUsers, winnersFruits});
        });

        // insert bets 
        socket.on("greadyInsertBets", (data) => {
            let amountInt = Number(data.bets.coinAmount);
            let boardInt = Number(data.bets.board);
            let myName = data.bets.userName;
            let myImg = data.bets.userImg;
            let userId = Number(data.bets.userId);
            let coinData = data.coin;

            // check index for users 
            const existingBetIndex = battingUsersUndersThisBoard.findIndex(
                bet => bet.board === boardInt && bet.userId === userId
            );
            if (existingBetIndex !== -1) {
                battingUsersUndersThisBoard[existingBetIndex].amount = parseFloat(battingUsersUndersThisBoard[existingBetIndex].amount) + parseFloat(amountInt);
            } else {
                battingUsersUndersThisBoard.push({
                    amount: amountInt,
                    board: boardInt,
                    name: myName,
                    image: myImg,
                    userId: userId
                });
            }

            // check index for winner 
            if([1, 6, 7, 8].includes(boardInt)){
                const existingBetIndexWinner = allAmountUndersThisBoard.findIndex(
                    bet => bet.board === boardInt
                );
                if (existingBetIndexWinner !== -1) {
                    allAmountUndersThisBoard[existingBetIndexWinner].amount = parseFloat(allAmountUndersThisBoard[existingBetIndexWinner].amount) + parseFloat(amountInt);
                } else {
                    allAmountUndersThisBoard.push({
                        amount: parseFloat(amountInt),
                        board: boardInt,
                    });
                }
            }
            
            // cal 
            betsCalculation(userId, -amountInt);

            greadyIo.emit("greadyShowBets", {coinData, amountInt});
        });

        socket.on('disconnect', () => {
            const index = allActiveUsers.findIndex(user => user.socket_id === socket.id);
            if (index !== -1) {
                allActiveUsers.splice(index, 1);
                greadyIo.emit('greadyActiveUsersShow', {allActiveUsers});

                console.log(allActiveUsers);
            }
        });
    });
}

module.exports = setupSocket;
