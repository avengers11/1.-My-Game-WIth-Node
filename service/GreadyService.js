const { User } = require('../models');
const { GreadyManage } = require('../service/global');

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
    var posibleRewards = [{ amount: 0, win_rate: 5 }, { amount: 0, win_rate: 10 }, { amount: 0, win_rate: 15 }, { amount: 0, win_rate: 25 }, { amount: 0, win_rate: 45 }, { amount: 0, win_rate: 5}, { amount: 0, win_rate: 5 }, { amount: 0, win_rate: 5 }];
    var totalBetRewards = [];

    // config 
    var botsConfig = "";

    let timer = 20;
    async function startTimer() {
        botsConfig = generateRandomConfig();
        
        setInterval(async () => {
            greadyManageDataValues = await GreadyManage();
            if (timer > 0) {
                timer--;

                // betting time 
                if(timer > 0  && timer < 11){
                    autoBot(timer);
                }

            } else {
                timer = 20;

                // winning process 
                const winners = await winningProcess();
                // rewards proccess 
                const rewardUsers = rewardsProcess(winners);

                botsConfig = generateRandomConfig();
                
                // reset posible winners 
                posibleRewards = [{ amount: 0, win_rate: 5 }, { amount: 0, win_rate: 10 }, { amount: 0, win_rate: 15 }, { amount: 0, win_rate: 25 }, { amount: 0, win_rate: 45 }, { amount: 0, win_rate: 5}, { amount: 0, win_rate: 5 }, { amount: 0, win_rate: 5 }]

                greadyIo.emit('greadyWinnersData',  {winners, winnersFruits, rewardUsers});
            }
            console.log("gready: " + timer);
            

            greadyIo.emit('greadyTimerUpdate', {timer});
        }, 1000);
    }
    startTimer();

    // winningProcess
    async function winningProcess() {
        greadyManageDataValues = await GreadyManage();
        const randomNumber = Math.floor(Math.random() * 1000) + 1;
        const randomNumber2 = Math.floor(Math.random() * 1000) + 1;

        // check mode 
        let calculationBoardNumber = "";
        
        // menuall 
        if(greadyManageDataValues.game_mod == 2){
            calculationBoardNumber = Number(greadyManageDataValues.next_win);
        }

        // rtp process 
        else if(greadyManageDataValues.game_mod == 3){
            let { totalBetAmount, totalWinAmount } = totalBetRewards.reduce((accumulator, current) => {
                accumulator.totalBetAmount += current.bet;
                accumulator.totalWinAmount += current.win;
                return accumulator;
            }, { totalBetAmount: 0, totalWinAmount: 0 });
            let rtp = greadyManageDataValues.rtp;
            
            let possibleWinners = posibleRewards.map(item => item.amount);
            if(possibleWinners.every(amount => amount === possibleWinners[0])){
                calculationBoardNumber = Math.floor(Math.random() * 8) + 1;
            }else{
                calculationBoardNumber = findBestWin(totalBetAmount, totalWinAmount, rtp, possibleWinners);
            }
        }

        else{
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
            "1.1": 1,
            "1.2": 2,
            "1.3": 3,
            "1.4": 4,
            "1.5": 5,
            "1.6": 6,
            "1.7": 7,
            "1.8": 8
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
    
        console.log(randomValue);
        return {
            frame: randomKey,
            board: randomValue,
            winRate: winRate
        };
    }
    function findBestWin(totalBetAmount, totalWinAmount, rtp, possibleWinners) {
        var ptr = rtp;
        var totalBet = totalBetAmount;
        var totalWin = totalWinAmount;
        var winArray = possibleWinners;
  
        // Initialize the results container
        var closestPTR = 0;
        var bestWin = 0;
        if (totalBet < totalWin) {
          bestWin = Math.min(...winArray);
          closestPTR = (totalWin + bestWin) / totalBet;
        }else{
          var targetPTR = ptr / 100;
          winArray.forEach(function(win) {
              var newTotalWin = totalWin + win;
              var newPTR = (newTotalWin / totalBet);
              if (Math.abs(newPTR - targetPTR) < Math.abs(closestPTR - targetPTR)) {
                closestPTR = newPTR;
                bestWin = win;
              }
          });
        }
        // board number 
        let board_number = winArray.indexOf(bestWin)+1;
        return board_number;
      }

    // rewardsProcess
    function rewardsProcess(winners) {
        let totalBet = 0;
        let totalRewards = 0;

        winnerUsersUndersThisBoard = [];
        battingUsersUndersThisBoard.forEach((curE) => {
            totalBet = totalBet + curE.amount;
            
            if (curE.board === winners.board) {
                let winAmount = curE.amount * winners.winRate;
                totalRewards = totalRewards + winAmount;

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

        totalBetRewards.push({"bet": totalBet, "win": totalRewards});
        if (totalBetRewards.length > 3) {
            totalBetRewards.shift();
        }
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
        // } catch (error) {
        //     console.error('Error fetching user:', error);
        //     return false;
        // }
    }

    // autoBot 
    function autoBot(time) {
        let tetsConf = botsConfig;
        if(botsConfig == ""){
            return false;
        }
    
        if (tetsConf.times.includes(time)) {
            let selectedBet = tetsConf.bets[time];
            let interval = 1000 / Object.keys(selectedBet).length;
    
            Object.keys(selectedBet).forEach((key, index) => {
                let [coin, quantity] = selectedBet[key];
                let amountInt = tetsConf.coinValues[coin];
    
                for (let i = 1; i <= quantity; i++) {
                    setTimeout(() => {
                        let { randomX, randomY } = getRandomPositionForBoard(key);
                        let coinData = { coin, randomX, randomY };
    
                        greadyIo.emit("greadyShowBets", { coinData, amountInt });
                    }, interval * index * i);
                }
            });
        }
    }
    function getRandomPositionForBoard(board) {
        let positions = {
            "1": { minX: 151, maxX: 222, minY: 99, maxY: 78 },
            "2": { minX: 300, maxX: 368, minY: 177, maxY: 155 },
            "3": { minX: 464, maxX: 532, minY: 109, maxY: 87 },
            "4": { minX: 535, maxX: 600, minY: -60, maxY: -36 }, 
            "5": { minX: 482, maxX: 550, minY: -220, maxY: -198 },
            "6": { minX: 298, maxX: 367, minY: -277, maxY: -254  },
            "7": { minX: 142, maxX: 213, minY: -204, maxY: -180       },
            "8": { minX: 124, maxX: 191, minY: -55, maxY: -35 }
        };
        let position = positions[board] || positions["8"];
        let randomX = getRandomInRange(position.minX, position.maxX);
        let randomY = getRandomInRange(position.minY, position.maxY);
        return { randomX, randomY };
    }
    function getRandomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }
    function generateRandomConfig() {
        let max_time_bets = 4;
        let max_board = 8;
        let max_coins = 4;


        // Random number of times (1 to max_time_bets)
        let random_times = [];
        let random_bets = {};
        let coin_values = {
            1: 500,
            2: 1000,
            3: 10000,
            4: 50000
        };

        let time_count = Math.floor(Math.random() * max_time_bets) + 1;
        for (let i = 0; i < time_count; i++) {
            let time = Math.floor(Math.random() * 9) + 2;
            random_times.push(time);
        }
    
        // Remove duplicates from random_times
        random_times = [...new Set(random_times)];
    
        random_times.forEach(time => {
            let board_count = Math.floor(Math.random() * max_board) + 1; // Random boards for each time
            random_bets[time] = {};
    
            for (let j = 0; j < board_count; j++) {
                let board = Math.floor(Math.random() * max_board) + 1;
                let coin = Math.floor(Math.random() * max_coins) + 1; // Random coin between 1 and 4
                let quantity = Math.floor(Math.random() * 4) + 1; // Random quantity between 1 and 4
                random_bets[time][board] = [coin, quantity];
            }
        });
    
        let random_config = {
            times: random_times,
            bets: random_bets,
            coinValues: coin_values
        };

        return random_config;
    }

    // manageDataOnConnect 
    greadyIo.on("greadyManageDataUpdate", (data) => {
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
            allActiveUsers.sort((a, b) => b.userAmount - a.userAmount);

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

            // possible rewards array 
            posibleRewards[boardInt-1].amount = posibleRewards[boardInt-1].amount + (amountInt*posibleRewards[boardInt-1].win_rate);

            greadyIo.emit("greadyShowBets", {coinData, amountInt});
        });

        socket.on('disconnect', () => {
            const index = allActiveUsers.findIndex(user => user.socket_id === socket.id);
            if (index !== -1) {
                allActiveUsers.splice(index, 1);
                greadyIo.emit('greadyActiveUsersShow', {allActiveUsers});
            }
        });
    });
}

module.exports = setupSocket;
