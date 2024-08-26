$(document).ready(function() {
    const $canvas = $('#canvas');
    const ctx = $canvas[0].getContext('2d');

    const coinImages = [
        // coins 
        '/assets/gready/coin1.png',
        '/assets/gready/coin2.png',
        '/assets/gready/coin3.png',
        '/assets/gready/coin4.png',

        // users 
        '/assets/gready/user-1.jpg',
    ];

    // Load images and draw them on the canvas
    const images = [];
    let imagesLoaded = 0;
    coinImages.forEach((src, index) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            images[index] = img;
            imagesLoaded++;
            
            if (imagesLoaded === coinImages.length) {
                //loader turn off
            }
        };
    });


    // Function to resize the canvas
    function resizeCanvas() {
        const aspectRatio = 1.2;
        const canvasHeight = Math.min(600, $(window).height());
        const canvasWidth = canvasHeight * aspectRatio;
        $canvas.attr('width', canvasWidth);
        $canvas.attr('height', canvasHeight);

        // Clear and redraw coins and user info on resize
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        drawCoins(); // Redraw coins after resize
    }

    // Function to draw the coins
    function drawCoins() {
        const coinSize = 50;
        const coinMargin = 10;
        const totalWidth = coinSize * coinImages.length + coinMargin * (coinImages.length - 1);
        
        // Set the position for the coins wrapper
        const wrapperX = $canvas[0].width - totalWidth - 20;
        const wrapperY = $canvas[0].height - coinSize - 20;
        

        // Draw the coins wrapper
        ctx.fillStyle = 'white';
        ctx.fillRect(350, 430, totalWidth + 20, coinSize + 20);

        // Draw the border for the wrapper
        ctx.strokeStyle = 'gold';
        ctx.lineWidth = 4;
        ctx.strokeRect(wrapperX, wrapperY, totalWidth + 20, coinSize + 20);

        // Draw the coins
        for (let i = 0; i < images.length; i++) {
            const coinX = wrapperX + i * (coinSize + coinMargin) + 10;
            const coinY = wrapperY + 10;
            // ctx.drawImage(images[i], coinX, coinY, coinSize, coinSize);
            console.log(images[i]);
            
        }
    }

    // Function to draw user info
    function drawUserInfo() {
        const userImageSize = 50; // Size of the user image
        const userImageX = 20; // X position for the user image
        const userImageY = $canvas[0].height - userImageSize - 20; // Y position for the user image (padding from bottom)

        // Draw user image in a circle
        const img = new Image();
        img.src = userImageSrc;
        img.onload = () => {
            // Draw circular mask for the user image
            ctx.save();
            ctx.beginPath();
            ctx.arc(userImageX + userImageSize / 2, userImageY + userImageSize / 2, userImageSize / 2, 0, Math.PI * 2);
            ctx.clip();

            // Draw the user image
            ctx.drawImage(img, userImageX, userImageY, userImageSize, userImageSize);
            ctx.restore();

            // Draw border around user image
            ctx.strokeStyle = 'gold'; // Border color
            ctx.lineWidth = 1; // Border thickness
            ctx.stroke(); // Draw the border

            // Draw the user name below the image
            ctx.fillStyle = 'white'; // Text color
            ctx.font = '14px Arial'; // Font style
            ctx.textAlign = 'center';
            ctx.fillText(userName, userImageX + userImageSize / 2, userImageY + userImageSize + 15); // Draw user name

            // Draw total coins text to the right
            ctx.fillText(`Total Coins: ${totalCoins}`, userImageX + userImageSize + 10, userImageY + userImageSize / 2 + 5);
        };
    }

    // Initial canvas size
    resizeCanvas();
    // $(window).resize(resizeCanvas);
});