$(document).ready(function() {
    // socket
    const origin = $("#origin").val();
    const socket = io(`${origin}/jili-ludo`);

    // global 
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
    // winnerResult 
    var winnerResult = [];
    var winnerUsers = [];
    var latestFiftyWinner = [];
    const myName = $("#user-name").val();
    const myImg = $("#user-img").val();
    const myId = Number($("#user-id").val());

    var coinsWrapper = $("body .main-game-wrapper .main-part2 .part2 .bottom-middle .coins-wrapper");
    coinsWrapper.find(".main-coin img").click(function(){
        coinsWrapper.find(".coins").addClass("active");
    });
    coinsWrapper.find(".coins .coin img, .main-coin img.active").click(function(){
        coinsWrapper.find(".coins").removeClass("active");

        let img = $(this).attr("src");
        let amount = Number($(this).attr("amount"));
        let coin = Number($(this).attr("coin"));

        coinsWrapper.find(".main-coin img").attr({
            src: img,
            amount: amount,
            coin: coin
        });
    });

    // =================IMPORTANT VAR=================
    const circleWrapper = $("body .main-game-wrapper .main-part1 .top .bowel-wrapper .disk .circle-wrapper");
    const small_board = $("body .main-game-wrapper .main-part1 .bottom .part2 .part2-top");
    function sliceText(st=0, end=10, txt){
        return txt.slice(st, end);
    }
    
    // ========== Active User ==========
    socket.emit("ludoActiveUsersConnect", {
       "name" : $("#user-name").val(),
       "pic" : $("#user-img").val(),
       "amount" : $("#my-balance").val()
    });
    socket.on('ludoActiveUsersShow', (data) => { 
        winnerResult = data.thisBoardWinner;
        winnerUsers = data.userBetsWinnerLudo;
        latestFiftyWinner = data.latestFiftyWinner;
        const sortedData = data.allActiveUsers.sort((a, b) => b.amount - a.amount);
        let top3ByAmountDescLength = sortedData.slice(0, 3);

        // all users 
        const mapData = sortedData.map((curE) => {
            return `
                <div class="user">
                    <img src="${curE.pic}" alt="">
                    <p>${sliceText(0, 10, curE.name)}</p>
                </div>
                `
        })
        $("div#activeUsers .modal-dialog .modal-content .modal-body .users-wrapper").html(mapData);
        // top 3
        const mapDataTop3 = top3ByAmountDescLength.map((curE) => {
            return `
                <div class="user">
                    <img src="${curE.pic}" alt="">
                    <p class="coins">${sliceText(0, 10, curE.name)}</p>
                </div>
                `
        })
        $("body .main-game-wrapper .main-part1 .top .bowel-wrapper .top-users").html(mapDataTop3);

        // getWinnerResult
        getWinnerResult();

    });

    // ========== Game Start ==========
    const winnerAnimation = (winnerArray) => {
        let randomValue1 = winnerArray[0];
        let randomValue2= winnerArray[1];
        let randomValue3= winnerArray[2];

        $(".diceWrap .dice.rolling").css("animation", `infinityLoop 0.5s linear infinite`);
        setTimeout(() => {
            $(".diceWrap .dice.rolling").css("animation", ``);
            $(".diceWrap .dice.rolling").css("animation", `infinityLoop 0.9s linear infinite`);

            setTimeout(() => {
                $(".diceWrap:nth-child(1) .dice.rolling").css("animation", `ludoDisk${randomValue1} 2s linear forwards`);
                $(".diceWrap:nth-child(2) .dice.rolling").css("animation", `ludoDisk${randomValue2} 2s linear forwards`);
                $(".diceWrap:nth-child(3) .dice.rolling").css("animation", `ludoDisk${randomValue3} 2s linear forwards`);
            }, 1000);
        }, 1000);
    }

    socket.on('timerUpdateLudo', (event) => {
        var time = event.timer;
        console.log(event);
        
        circleWrapper.find(".circle-number").html(15);
        circleWrapper.find(".circle__spinner .path").css('stroke-dasharray', `130, 150`);

        // start board
        if(time > 0 && time < 16){

            circleWrapper.removeClass("d-none");
            small_board.find(".inner").attr("disabled", false);
            let stoke =  Number(time*8.666666666666667);
            circleWrapper.find(".circle-number").html(time);
            circleWrapper.find(".circle__spinner .path").css('stroke-dasharray', `${stoke}, 150`);
        }else{
            circleWrapper.addClass("d-none");
            small_board.find(".inner").attr("disabled", true);
        }

        // result
        if(time == 25){ //25, 24
            $(".bet-result-model").addClass("active");
            $("body .main-game-wrapper .custom-model-wrapper .custom-model .img-wrapper").html(`
                <img src="/assets/ludo/new-chokka-${winnerResult.winner[0]}.png" alt="">
                <img src="/assets/ludo/new-chokka-${winnerResult.winner[1]}.png" alt="">
                <img src="/assets/ludo/new-chokka-${winnerResult.winner[2]}.png" alt="">
            `);
            $(`body .main-game-wrapper .main-part1 .bottom .part2 .part2-middle .win3x-${winnerResult.winner3}`).removeClass("active");
                $(`body .main-game-wrapper .main-part1 .bottom .part2 .part2-top .inner:nth-child(${winnerResult.boardNumber})`).removeClass("active");

            setTimeout(() => {
                $(".bet-result-model").removeClass("active");
            }, 2000);

        }

        // getUserInfo
        if(time == 20){
            getWinnerResult();
            getUserInfo(myId);
            getWinnerUsers();
        }

        if(time == 16){
            $(".start-bet-model").addClass("active");
            setTimeout(() => {
                $(".start-bet-model").removeClass("active");
            }, 1000);
        }

        // winner  users
        if(time == 20){ // 20, 19, 18, 17
            $("#bet-winner-users").addClass("active");
            $("body .main-game-wrapper .main-part1 .bottom .part2 .part2-middle .board, body .main-game-wrapper .main-part1 .bottom .part2 .part2-top .inner").removeClass("active");
            $("body .main-game-wrapper .main-part1 .bottom .part2 .part2-top .inner .coins").html("");
            $("body .main-game-wrapper .main-part1 .bottom .part2 .part2-top .inner").removeClass("active-coin");
            $("span#my-bet").html("0");
            $("body .main-game-wrapper .main-part1 .bottom .part1 .bet-amount p span.bet").html("0");
            $(`body .main-game-wrapper .main-part1 .bottom .part2 .part2-top .inner:nth-child(${winnerResult.boardNumber})`).removeClass("active");
            setTimeout(() => {
                $("#bet-winner-users").removeClass("active");
            }, 4000);
        }

        if(time < 1){
            $(".bet-lock-model").addClass("active");
        }
    });
    socket.on('ludoWinner', (event) => {
        let winner = event.thisBoardWinner.winner;
        winnerResult = event.thisBoardWinner;
        winnerUsers = event.userBetsWinnerLudo;
        latestFiftyWinner = event.latestFiftyWinner;

        $(".bet-lock-model").removeClass("active");
        $("body .main-game-wrapper .main-part1 .bottom .part2 .part2-middle .board, body .main-game-wrapper .main-part1 .bottom .part2 .part2-top .inner").addClass("active");
        winnerAnimation([winner[0], winner[1], winner[2]]);
    });

    // ============ Bet Insert =================
    small_board.on("click", ".inner", function(){
        let $this = $(this);
        betInsert($this);
    });
    const betInsert = (this_elem) => {
        this_elem.addClass("active-coin");

        

        // count board
        if ($("body .main-game-wrapper .main-part1 .bottom .part2 .part2-top .inner.active-coin").length > 2) {
            this_elem.removeClass("active-coin");
            return false;
        }

        let board = this_elem.find("input.board").val();
        let amount = Number($("body .main-game-wrapper .main-part2 .part2 .bottom-middle .coins-wrapper .main-coin img").attr("amount"));
        let coin = $("body .main-game-wrapper .main-part2 .part2 .bottom-middle .coins-wrapper .main-coin img").attr("coin");

        // check amount 
        if(Number($("#my-balance").text()) < amount){
            return false;
        }

        let id = new Date().getTime()+1;
        let top = Number((Math.random() * 60) + 5).toFixed(0);
        let left = Number((Math.random() * 75) + 5).toFixed(0);
        let img = `<img id="${id}" class="coin${coin}" src="/assets/ludo/coin${coin}.png" alt="" />`;
        const coins_data = {
            amount,
            board,
            id,
            top,
            left,
            "img": img
        };

        $("#my-balance").text(Number($("#my-balance").text()) - amount);
        $("#my-bet").text(Number($("#my-bet").text()) + amount);

        // return 
        socket.emit("ludoBetInsert", {
            "user" : {
                myName,
                myImg,
                amount,
                board,
                myId
            },
            "coin" : coins_data
        });
    }
    socket.on('ludoBetShow', (event) => {
        console.log(event);

        // all coins 
        let boardAmount = Number($(`body .main-game-wrapper .main-part1 .bottom .part1 .bet-amount p:nth-child(${event.board}) span.bet`).text());
        $(`body .main-game-wrapper .main-part1 .bottom .part1 .bet-amount p:nth-child(${event.board}) span.bet`).text(boardAmount + event.amount);

        // insert coins 
        $(`body .main-game-wrapper .main-part1 .bottom .part2 .part2-top .inner:nth-child(${event.board}) .coins`).append(event.img);
        $(`#${event.id}`).animate({
            left: `${event.left}%`,
            top: `${event.top}%`,
        }, 400);
    });

    // ============ Get Winner & My winner =================
    const getWinnerUsers = () => {
        console.log(winnerUsers);
        
        let myData = winnerUsers.filter(item => item.id === myId);
        let sortedArray = winnerUsers.sort((a, b) => b.amount - a.amount);
        let top3ByAmountDesc = sortedArray.slice(0, 3);
        let top3ByAmountDescLength = sortedArray.slice(0, 3);

        const filterData = top3ByAmountDesc.map((curE, index) => {
            let winImg = "";
            if(index == 0){
                winImg = "/assets/ludo/hat-l.png";
            }else if(index == 1){
                winImg = "/ludo/winner-2.png";
            }else{
                winImg = "/assets/ludo/winner-3.png";
            }
            return `
            <div class="user">
                <div class="img">
                    <img src="" alt="" class="winner-hat">
                    <img class="profile" src="${curE.myImg}" alt="">
                    <p class="name">${curE.myName}</p>
                </div>
                <div class="amount">
                    <p class="bet"><span class="text">WIN: </span> <span class="a">${curE.amount}</span></p>
                </div>
            </div>
            `;
        });

        $("#winner-users").html(filterData);
        $("#pop-up-mybet").text($("span#my-bet").text());
        $("#pop-up-mywin").text(myData.amount);
    }
    getWinnerUsers();
    
    const getWinnerResult = () => {
        let countRange4to10 = 0;
        let countRange11to17 = 0;
        latestFiftyWinner.forEach(item => {
            if (item.number_winner >= 4 && item.number_winner <= 10) {
                countRange4to10++;
            } else if (item.number_winner >= 11 && item.number_winner <= 17) {
                countRange11to17++;
            }
        });
        let totalElements = latestFiftyWinner.length;
        let percentage4to10 = (countRange4to10 / totalElements) * 100;
        let percentage11to17 = (countRange11to17 / totalElements) * 100;
        if(latestFiftyWinner.length > 0){
            $("body .main-game-wrapper .main-part1 .top .bowel-wrapper .winnerRecord .mr-top .part1 p.right").text(percentage4to10.toFixed(0));
            $("body .main-game-wrapper .main-part1 .top .bowel-wrapper .winnerRecord .mr-top .part2 p.right").text(percentage11to17.toFixed(0));
        }
        
        
        var sortTop9 = latestFiftyWinner.slice(0, 9);
        const mapingData = sortTop9.map((curE, index) => {
            return `
            <div class="winner">
                <p class="win small">${curE.number_winner}</p>
                <div class="img">
                    <img src="/assets/ludo/new-chokka-${curE.winner[0]}.png" alt="">
                    <img src="/assets/ludo/new-chokka-${curE.winner[1]}.png" alt="">
                    <img src="/assets/ludo/new-chokka-${curE.winner[2]}.png" alt="">
                </div>
            </div>
            `;
        })
        $("body .main-game-wrapper .main-part1 .top .bowel-wrapper .winnerRecord .mr-bottom").html(mapingData);
    }

    // ============ Get User Info =================
    const getUserInfo = (id) => {
        $.ajax({
            "url" : `/ludo/get-info/${id}`,
            "method" : "GET",
            success:function(data){
                $("span#my-balance").text(data.amount);
            }
        })
    }

    // ===========Others===========
    function updateWindowHeight() {
        var windowHeight = $(window).height();
        
        if(windowHeight < 450){
            $("#body").addClass("small");
        }else{
            $("#body").removeClass("small");
        }
    }

    updateWindowHeight();

    $(window).on('resize', updateWindowHeight);

    // open side bar 
    $("body .main-game-wrapper .main-part1 .top .bowel-wrapper .menubarWrapper .settings").click(function(){
        $("body .main-game-wrapper .main-part1 .top .bowel-wrapper .hiddenModels.settings").addClass("active");
    });
    $("body .main-game-wrapper .main-part1 .top .bowel-wrapper .hiddenModels .model-wrapper .close i, body .main-game-wrapper .main-part1 .top .bowel-wrapper .hiddenModels .model-wrapper .items-wrapper .item").click(function(){
        $("body .main-game-wrapper .main-part1 .top .bowel-wrapper .hiddenModels").removeClass("active");
    });

    $("body .main-game-wrapper .main-part1 .top .bowel-wrapper .menubarWrapper .mainmenu").click(function(){
        $("body .main-game-wrapper .main-part1 .top .bowel-wrapper .hiddenModels.mainmenu").addClass("active");
    });
    
    // open & close winner users 
    $("body .main-game-wrapper .custom-model-wrapper .custom-model p.close").click(function(){
        $("div#bet-winner-users").removeClass("active");
    });
    $("body .main-game-wrapper .main-part1 .top .bowel-wrapper .hiddenModels .model-wrapper .items-wrapper .item.winnerUsers").click(function(){
        $("div#bet-winner-users").addClass("active");
    });
    
});


// test 

$(window).click(function(){
    

    console.log(origin);
});
