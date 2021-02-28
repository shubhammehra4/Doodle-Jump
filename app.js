document.addEventListener("DOMContentLoaded", () => {
    var Music;
    const grid = document.querySelector(".grid");
    const doodler = document.createElement("div");
    // doodler.src = "doodler.png";
    const doolerImage = document.createElement("img");
    doolerImage.src = "doodler.png";
    doodler.appendChild(doolerImage);
    let startPoint = 200;
    let doodlerLeftSpace = 50;
    let doodlerBottomSpace = startPoint;
    let isGameOver = false;
    let platformCount = 7;
    let platforms = [];
    let upTimerId;
    let downTimerId;
    let isJumping = true;
    let isGoingLeft = false;
    let isGoingRight = false;
    let leftTimerId;
    let rightTimerId;
    let score = 0;

    function clearGrid() {
        while (grid.firstChild) {
            grid.removeChild(grid.firstChild);
        }
    }

    function createDoodler() {
        grid.appendChild(doodler);
        doodler.classList.add("doodler");
        doodlerLeftSpace = platforms[0].left;
        doodler.style.left = doodlerLeftSpace + "px";
        doodler.style.bottom = doodlerBottomSpace + "px";
    }

    class Platform {
        constructor(newPlatBottom) {
            this.bottom = newPlatBottom;
            this.left = Math.random() * 415;
            this.visual = document.createElement("div");

            const visual = this.visual;
            visual.classList.add("platform");
            visual.style.left = this.left + "px";
            visual.style.bottom = this.bottom + "px";
            grid.appendChild(visual);
        }
    }

    function createPlatforms() {
        let platGap = 800 / platformCount;

        for (let i = 0; i < platformCount; i++) {
            let newPlatBottom = 100 + i * platGap;
            let newPlatform = new Platform(newPlatBottom);
            platforms.push(newPlatform);
        }
    }

    function movePlatforms() {
        if (doodlerBottomSpace > 250) {
            platforms.forEach((p) => {
                p.bottom -= 4;
                let visual = p.visual;
                visual.style.bottom = p.bottom + "px";
                if (p.bottom < 10) {
                    let firstPlatform = platforms[0].visual;
                    firstPlatform.classList.remove("platform");
                    platforms.shift();
                    score++;
                    let newPlatform = new Platform(800);
                    platforms.push(newPlatform);
                }
            });
        }
    }

    function jump() {
        clearInterval(downTimerId);
        isJumping = true;
        upTimerId = setInterval(function () {
            doodlerBottomSpace += 20;
            doodler.style.bottom = doodlerBottomSpace + "px";
            if (doodlerBottomSpace > startPoint + 200) {
                fall();
            }
        }, 25);
    }

    function fall() {
        clearInterval(upTimerId);
        isJumping = false;
        downTimerId = setInterval(function () {
            doodlerBottomSpace -= 5;
            doodler.style.bottom = doodlerBottomSpace + "px";
            if (doodlerBottomSpace <= 0) {
                gameOver();
            }
            platforms.forEach((p) => {
                if (
                    doodlerBottomSpace >= p.bottom &&
                    doodlerBottomSpace <= p.bottom + 15 &&
                    doodlerLeftSpace + 60 >= p.left &&
                    doodlerLeftSpace <= p.left + 85 &&
                    !isJumping
                ) {
                    console.log("Landed!");
                    startPoint = doodlerBottomSpace;
                    jump();
                }
            });
        }, 25);
    }

    function moveLeft() {
        if (isGoingRight) {
            clearInterval(rightTimerId);
            isGoingRight = false;
        }
        clearInterval(leftTimerId);
        isGoingLeft = true;
        leftTimerId = setInterval(function () {
            if (doodlerLeftSpace >= 0) {
                doodlerLeftSpace -= 5;
                doodler.style.left = doodlerLeftSpace + "px";
            } else moveLeft();
        }, 25);
    }

    function moveRight() {
        if (isGoingLeft) {
            clearInterval(leftTimerId);
            isGoingLeft = false;
        }
        clearInterval(rightTimerId);
        isGoingRight = true;
        rightTimerId = setInterval(function () {
            if (doodlerLeftSpace <= 440) {
                doodlerLeftSpace += 5;
                doodler.style.left = doodlerLeftSpace + "px";
            } else moveStraight();
        }, 25);
    }

    function moveStraight() {
        isGoingLeft = false;
        isGoingRight = false;
        clearInterval(rightTimerId);
        clearInterval(leftTimerId);
    }

    function control(e) {
        switch (e.key) {
            case "ArrowLeft":
                moveLeft();
                break;
            case "ArrowRight":
                moveRight();
                break;
            default:
                moveStraight();
                break;
        }
    }

    function gameOver() {
        console.log("Game Over!");
        isGameOver = true;
        Music.stop();
        clearInterval(upTimerId);
        clearInterval(downTimerId);
        clearInterval(leftTimerId);
        clearInterval(rightTimerId);
        clearGrid();
        const gameOverScreen = document.querySelector("#over");
        const gameOverContent = gameOverScreen.content.cloneNode(true);
        grid.appendChild(gameOverContent);
        let scoreDisplay = document.querySelector("#score");
        let restartButton = document.querySelector("#start");
        let toHome = document.querySelector("#toHome");
        restartButton.addEventListener("click", function () {
            clearGrid();
            isGameOver = false;
            platforms = [];
            start();
        });
        scoreDisplay.innerHTML = score;
        toHome.addEventListener("click", home);
    }

    function sound(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        this.sound.loop = true;
        document.body.appendChild(this.sound);
        this.play = function () {
            this.sound.play();
        };
        this.stop = function () {
            this.sound.pause();
        };
    }

    function start() {
        if (!isGameOver) {
            Music = new sound("doodle-song.mp3");
            Music.play();
            createPlatforms();
            createDoodler();
            setInterval(movePlatforms, 30);
            jump();
            document.addEventListener("keyup", control);
        }
    }

    function home() {
        isGameOver = false;
        platforms = [];
        clearGrid();
        const homeScreen = document.querySelector("#home");
        const homeContent = homeScreen.content.cloneNode(true);
        grid.appendChild(homeContent);
        let startButton = document.querySelector("#start");
        startButton.addEventListener("click", function () {
            console.log("hello");
            clearGrid();
            start();
        });
    }
    home();
});
