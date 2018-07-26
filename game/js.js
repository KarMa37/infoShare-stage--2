const sectionWidth = 200;
const $map = $('.map');
const $numberOfSections = parseInt($map.css('width')) / sectionWidth;


//***************MAP GENERATOR***************

(function () {

    const obstacleWidth = 80;
    const obstacleMinHeight = 60;
    const randomizer = .4;
    let mapObjectTable;

    $('body').append($('<div>').addClass('odnosnik'));

    mapObjectTable = Array
        .from({length: $numberOfSections}, (obstacle, index) => {
            if (index !== 0) {
                return {
                    position: index * sectionWidth + Math.floor(Math.random() * (sectionWidth - obstacleWidth)),
                    height: Math.floor((Math.random() * 2 + 1)) * obstacleMinHeight
                }
            }
        })
        .filter(obstacle => {
            return (obstacle !== undefined && Math.random() > randomizer)
        })
        .forEach(obstacle => {
            $map
                .append($('<div>')
                    .addClass('obstacle')
                    .css('left', obstacle.position)
                    .css('height', obstacle.height)
                )
        });

})();

// player.style.left = playerPositionX + 'px';

//***************PLAYER***************

(function () {

    const player = document.querySelector('#player');

    let playerPositionX = 0;
    let playerPositionY = 0;
    let playerSpeedX = 0;
    let playerSpeedY = 0;
    let playerAcceleration = 0.0005;
    let keyPressed = '';
    let jumpKeyPressed = '';
    let time = Date.now();

    update();

    window.addEventListener('keydown', function (event) {
        if (event.code === 'ArrowRight' || event.code === 'ArrowLeft') {
            event.preventDefault();
            keyPressed = event.code;
        }
    });

    window.addEventListener('keyup', function (event) {
        if (event.code === 'ArrowRight' || event.code === 'ArrowLeft') {
            event.preventDefault();
            keyPressed = '';
        }
    });

    window.addEventListener('keydown', function (event) {
        if (event.code === 'ArrowUp' && jumpKeyPressed !== 'jumpReleased') {
            event.preventDefault();
            jumpKeyPressed = event.code;
        }
    });

    window.addEventListener('keyup', function (event) {
        if (event.code === 'ArrowUp') {
            event.preventDefault();
            jumpKeyPressed = 'jumpReleased';
        }
    });

    function update() {

        const dTime = Date.now() - time;
        time = Date.now();

        playerPositionX += playerSpeedX * dTime;
        playerPositionY += playerSpeedY * dTime;


        switch (keyPressed) {

            case 'ArrowRight':
                playerSpeedX = Math.min(
                    Math.max(
                        0,
                        playerSpeedX + playerAcceleration * dTime
                    ),
                    0.4
                );
                break;

            case 'ArrowLeft':
                playerSpeedX = Math.max(
                    Math.min(
                        0,
                        playerSpeedX - playerAcceleration * dTime
                    ),
                    -0.4
                );
                break;

            default:
                playerSpeedX = 0;

        }

        switch (jumpKeyPressed) {

            case 'ArrowUp':
                playerSpeedY = (playerPositionY >= 0) ? playerSpeedY + playerAcceleration * dTime : playerPositionY = 0;
                break;

            case 'jumpReleased':
                playerSpeedY = (playerPositionY > 0) ? playerSpeedY - playerAcceleration * dTime : playerPositionY = 0;
                break;

            default:
                playerSpeedY = 0;

        }

        if (jumpKeyPressed === 'ArrowUp' && playerSpeedY > 0.3) {
            jumpKeyPressed = 'jumpReleased'
        }

        if (jumpKeyPressed === 'jumpReleased' && playerPositionY === 0) {
            jumpKeyPressed = '';
        }

        player.style.left = playerPositionX + 'px';
        player.style.bottom = playerPositionY + 'px';
        requestAnimationFrame(update);

    }
})();


//***************CLOUDS***************

(function () {
    const cloudMinWidth = 20;
    const cloudRandomizer = .2;
    let mapCloudTable;
    const $sky = $('.sky');

    mapCloudTable = Array
        .from({length: $numberOfSections}, (cloud, index) => {
            return {
                position: index * sectionWidth + Math.floor(Math.random() * sectionWidth),
                width: Math.ceil(Math.random() * 10) * cloudMinWidth,
                marginTop: Math.ceil(Math.random() * 10) * cloudMinWidth,
                zIndex: Math.ceil(Math.random() * 10),
            }
        })
        .filter(cloud => Math.random() > cloudRandomizer)
        .forEach(cloud => {
            $sky
                .append($('<div>')
                    .addClass('cloud')
                    .css('left', cloud.position)
                    .css('top', cloud.marginTop)
                    .css('width', cloud.width)
                    .css('height', cloud.width * .44)
                    .css('z-index', cloud.zIndex)
                )
        });
})();
