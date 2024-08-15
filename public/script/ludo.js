$(document).ready(function() {
    $("body .main-game-wrapper .main-part2 .part2 .bottom-middle .coins-wrapper .main-coin img").click(function(){
        $("body .main-game-wrapper .main-part2 .part2 .bottom-middle .coins-wrapper .coins").addClass("active");
    });
    $("body .main-game-wrapper .main-part2 .part2 .bottom-middle .coins-wrapper .coins .coin img").click(function(){
        $("body .main-game-wrapper .main-part2 .part2 .bottom-middle .coins-wrapper .coins").removeClass("active");
    });

    const animationDIsk3 = () => {
        let diskArray = [1, 2, 3, 4, 5, 6];
        let randomIndex1 = Math.floor(Math.random() * diskArray.length);
        let randomIndex2 = Math.floor(Math.random() * diskArray.length);
        let randomIndex3 = Math.floor(Math.random() * diskArray.length);
        let randomValue1 = diskArray[randomIndex1];
        let randomValue2= diskArray[randomIndex2];
        let randomValue3= diskArray[randomIndex3];

        $(".diceWrap .dice.rolling").css("animation", `infinityLoop 0.5s linear infinite`);
        setTimeout(() => {
            $(".diceWrap .dice.rolling").css("animation", ``);
            $(".diceWrap .dice.rolling").css("animation", `infinityLoop 0.9s linear infinite`);

            setTimeout(() => {
                $(".diceWrap:nth-child(1) .dice.rolling").css("animation", `ludoDisk${randomValue1} 2s linear forwards`);
                $(".diceWrap:nth-child(2) .dice.rolling").css("animation", `ludoDisk${randomValue2} 2s linear forwards`);
                $(".diceWrap:nth-child(3) .dice.rolling").css("animation", `ludoDisk${randomValue3} 2s linear forwards`);
                setTimeout(() => {
                    animateClock();
                }, 2000);
            }, 1000);
        }, 1000);
    }

    const animateClock = () => {
        $("body .main-game-wrapper .main-part1 .top .bowel-wrapper .disk .circle-wrapper").removeClass("d-none");
        $("body .main-game-wrapper .main-part1 .top .bowel-wrapper .disk .circle-wrapper .circle__item .circle-number").html(15);
        $("body .main-game-wrapper .main-part1 .top .bowel-wrapper .disk .circle-wrapper .circle__item .circle__spinner .path").css('stroke-dasharray', `130, 150`);

        let time = 15;
        var x = setInterval(() => {
            time = time-1;

            let stoke =  Number(time*8.666666666666667);
            $("body .main-game-wrapper .main-part1 .top .bowel-wrapper .disk .circle-wrapper .circle__item .circle-number").html(time);
            $("body .main-game-wrapper .main-part1 .top .bowel-wrapper .disk .circle-wrapper .circle__item .circle__spinner .path").css('stroke-dasharray', `${stoke}, 150`);

            if(time < 1){
                clearInterval(x);
                $("body .main-game-wrapper .main-part1 .top .bowel-wrapper .disk .circle-wrapper").addClass("d-none");
                animationDIsk3();
            }
        }, 1000);
    }
    animateClock();


    function updateWindowHeight() {
        var windowHeight = $(window).height();
        console.log(windowHeight);
        
        if(windowHeight < 450){
            $("#body").addClass("small");
        }else{
            $("#body").removeClass("small");
        }
    }

    updateWindowHeight();

    $(window).on('resize', updateWindowHeight);
});
