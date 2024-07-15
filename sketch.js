    /*
    Game Project Final
    */

    var groundHeight;
    var cameraPosx;
    var gameScore;
    var hearts;
    var heartArray;
    var lives;

    var charPiggy_x;
    var charPiggy_y;
    var skyColourTop;
    var skyColourBottom;
    var groundColourTop;
    var groundColourBottom;
    var cloud1_x;
    var cloud2_x;
    var cloud3_x;
    var tree;
    var trees_x;
    var rightMountain;
    var rightSnowPeak;
    var rightMountainArray;
    var leftMountain;
    var leftSnowPeak;
    var leftMountainArray;
    var canyon;
    var canyonArray;
    var mango;
    var mangoArray;
    var flagpole;
    var platforms;
    var enemies;

    var isLeft = false;
    var isRight = false;
    var isJumping = false;
    var isFalling = false;
    var isPlummeting = false;
    var isReached = false;

    var backgroundSound;
    var jumpSound;
    var fallSound;
    var collectableSound;
    var levelCompleteSound;
    var gameOverSound;

    function preload()
    {
        soundFormats('mp3','wav');

        //load your sounds here
        backgroundSound = loadSound('sounds/background.wav');
        backgroundSound.setVolume(0.05);

        jumpSound = loadSound('sounds/jump.wav');
        jumpSound.setVolume(0.1);

        fallSound = loadSound('sounds/falling.wav');
        fallSound.setVolume(0.1);

        collectableSound = loadSound('sounds/collectable.wav');
        collectableSound.setVolume(0.4);

        levelCompleteSound = loadSound('sounds/level complete.wav');
        levelCompleteSound.setVolume(0.1);

        gameOverSound = loadSound('sounds/game over.wav');
        gameOverSound.setVolume(0.1);
    }

    function setup()
    {
        createCanvas(1024, 576);
        groundHeight = (height * 3/4) + 5;
        lives = 3;

        startGame();
    }

    function startGame()
    {
        //sky
        skyColourTop = color(135, 206, 250); // light blue color at the top
        skyColourBottom = color(173, 216, 230); // darker blue color at the bottom
        groundColourTop = color(138, 215, 91); // light green color at the top
        groundColourBottom = color(34, 139, 34); // darker green color at the bottom

        charPiggy_x = -800;
        charPiggy_y = groundHeight + 5;

        cameraPosx = 0;
        gameScore = 0; 

        cloud1_x = -1150;
        cloud2_x = -480;
        cloud3_x = -800;

        rightMountainArray = [-800, -250, 360, 1000];

        rightMountain = {
            x1: 360,
            y1: groundHeight,
            x2: 525,
            y2: 185,
            x3: 708,
            y3: groundHeight
        };

        rightSnowPeak = {
            y1: rightMountain.y1 - 182,
            y2: rightMountain.y1 - 192
        }

        leftMountainArray = [-900, -350, 260, 900];

        leftMountain = {
            x1: 260,
            y1: groundHeight,
            x2: 366, //leftMountainArray[i] + 101
            y2: 255,
            x3: 530, //leftMountainArray[i] + 270
            y3: groundHeight
        }

        leftSnowPeak = {
            x1: 320, //leftMountainArray[i] + 60
            y1: 323,
            x2: 360, //leftMountainArray[i] + 100
            y2: 320
        }

        tree = {
            x: 760,
            y: groundHeight - 100,
            trunkWidth: 40,
            trunkHeight: 100,
        };

        trees_x = [-800, -550, -300, 300, 500, 900, 1150]; // tree array

        canyon = {
            pos_x: 140,
            pos_y: 433,
            width: 80,
            height: 313
        }

        canyonArray = [-450, 140, 740]; 

        mango = { 
            pos_x: 370,
            pos_y: 413,
            width: 30,
            height: 40,
            isFound: false
        }

        mangoArray = [
             { 
                pos_x: -600,
                pos_y: 413,
                width: 30,
                height: 40,
                isFound: false
            },
            { 
                pos_x: -200,
                pos_y: 413,
                width: 30,
                height: 40,
                isFound: false
            },
            { 
                pos_x: 370,
                pos_y: 413,
                width: 30,
                height: 40,
                isFound: false
            },
            { 
                pos_x: 950,
                pos_y: 413,
                width: 30,
                height: 40,
                isFound: false
            }
        ];

        flagpole = {
            pos_x: 1000,
            pos_y: groundHeight,
            isReached: false
        }

        platforms = [];
        //creating platforms
        platforms.push(createPlatforms(50, groundHeight - 100, 100));
        platforms.push(createPlatforms(600, groundHeight - 60, 130));

        enemies = [];
        //creating enemies
        enemies.push(new Enemy(-150, groundHeight - 20, 100));
        enemies.push(new Enemy(370, groundHeight - 20, 100));
    }

    function draw()
    {

        ///////////DRAWING CODE//////////

        //background music
        backgroundSound.play();

        //sky
        setGradient(0, 0, width, groundHeight, skyColourTop, skyColourBottom); 

        //ground
        noStroke();
        fill(138, 215, 91);
        rect(0, groundHeight, width, height - groundHeight);

        //ground gradient
        setGradient(0, groundHeight + 5, width, height - groundHeight + 5, groundColourTop, groundColourBottom); 

        //sidescrolling
        cameraPosx = charPiggy_x - 100; 
        push();
        translate(-cameraPosx, 0);

        //clouds
        drawClouds();

        //mountains
        drawMountains();

        //trees
        drawTrees();

        //canyons
        drawCanyon(canyon);
        //piggy falls if walking over canyon
        checkCanyon(canyon);
        
        //if piggy dies, restart game until lives < 1
        checkPiggyDie();

        //mango
        checkMango(mango);

        //mango disappear if collected
        for (i = 0; i < mangoArray.length; i++)
            {
                if (!mangoArray[i].isFound)
                    {
                        drawMango(mangoArray[i]);
                        checkMango(mangoArray[i]);
                    }
            }

        //platforms
        for (var i = 0; i < platforms.length; i++)
            {
                platforms[i].draw();
            }

        noStroke();
        //game score
        fill(255);
        textFont('Comic Sans');
        textSize(30);
        text("\nScore: " +gameScore, cameraPosx + 500, 10);

        //lives
        fill(255);
        textFont('Comic Sans');
        textSize(30);
        text("\nLives: " +lives, cameraPosx + 50, 10);

        //draw piggy game character
        drawPiggy();
        
        //decrement 1 life if piggy hit enemy
        for (var i = 0; i < enemies.length; i++)
            {
                enemies[i].draw();

                var isContact = enemies[i].checkContact(charPiggy_x, charPiggy_y);

                if (isContact == true)
                {
                    if (lives > 0)
                        {
                            lives -= 1;
                            startGame();
                            break;
                        }
                }
            }

        //coordinate cursor
        fill(0);
        textSize(15);
        text("(" + mouseX + ", " + mouseY + ")", mouseX, mouseY);
        stroke(0);

        //draw flagpole raised/unraised
        renderFlagpole();
        if (flagpole.isReached == false)
            {
                checkFlagpole(); 
            }

        //game over & level complete
        if (lives < 1)
            {
                stroke(255);
                fill(178,34,34);
                textSize(60);
                text("\nGAME OVER", cameraPosx + 400, 210);
                noStroke();
                fill(255);
                textSize(25);
                textStyle(BOLD);
                text("\nPress space to restart", cameraPosx + 450, 280);
                textStyle(NORMAL);
                gameOverSound.play();

                return;
            }

        if (dist(charPiggy_x, charPiggy_y, flagpole.pos_x, flagpole.pos_y) < 20)
            {
                stroke(255);
                fill(72,61,139);
                textSize(60);
                text("\nLEVEL COMPLETE", cameraPosx + 300, 210);
                noStroke();
                fill(255);
                textSize(25);
                textStyle(BOLD);
                text("\nPress space to restart", cameraPosx + 450, 280);
                textStyle(NORMAL);
                levelCompleteSound.play();

                return;
            }

        pop();

        
        ///////////INTERACTION CODE//////////
        //Put conditional statements to move the game character below here
        if (charPiggy_y < groundHeight)
        {
            var isContact = false; 
            for (var i = 0; i < platforms.length; i++)
                {
                    if (platforms[i].checkContact(charPiggy_x, charPiggy_y));
                    {
                        isContact = true;
                        break;
                    }

                }
            if (isContact == false)
                {
                    charPiggy_y += 3;
                    isPlummeting = true;
                } 
            charPiggy_y += 3;
        }
        if(isPlummeting)
            {
                charPiggy_y += 5;
            }
        if (isLeft == true) //if left arrow pressed - walk left
            {
                charPiggy_x -= 5;
            }
        if (isRight == true) //if right arrow pressed - walk right
            {
                charPiggy_x += 5;
            }
        if (isJumping == true) //if up arrow pressed - jump
            {
                charPiggy_y - 100;
            }
    }

    function keyPressed()
    {
        // if statements to control the animation of the character when keys are pressed.

        console.log("keyPressed: " + key);
        console.log("keyPressed: " + keyCode);

        if (keyCode == 37) //if left arrow is pressed
        {
            console.log("left arrow");
            isLeft = true;
        }
        else if (keyCode == 39) //if right arrow is pressed
        {
            console.log("right arrow");
            isRight = true;
        }
        else if (keyCode == 38) //if up arrow is pressed
        {      
            if (charPiggy_y >= groundHeight) //prevent double jumping
                {
                    charPiggy_y -= 150;
                    isJumping = true; // Set jumping to true
                    jumpSound.play();
                }

        }
         else if (keyCode == 32) //if spacebar is pressed
             {
                 console.log("space");
             }       
    }

    function keyReleased()
    {
        // if statements to control the animation of the character when keys are released.

        console.log("keyReleased: " + key);
        console.log("keyReleased: " + keyCode);

        if (keyCode == 37) //left
            {
                isLeft = false;
            }
        else if (keyCode == 39) //right
            { 
                isRight = false;
            }
        else if (keyCode == 38) //up
            {
                isJumping = false;
            }
        else if (keyCode == 32) //space
            {
                lives = 3;
                startGame();
                isPlummeting = false;
            }
    }

    function setGradient(x, y, w, h, c1, c2) 
    {
        noFill();
        for (let i = y; i <= y + h; i++) {
        let inter = map(i, y, y + h, 0, 1);
        let c = lerpColor(c1, c2, inter);
        stroke(c);
        line(x, i, x + w, i);
      }
    }  

    function drawClouds()
    {
        noStroke();
        fill(255);
        ellipse(cloud1_x, 60, 100, 70, 50); //cloud 1
        ellipse(cloud1_x + 50, 60, 90, 50);
        ellipse(cloud1_x - 50, 60, 90, 50);
        ellipse(cloud1_x + 90, 60, 60, 30);
        ellipse(cloud1_x - 90, 60, 60, 30);

        fill(255);
        ellipse(cloud2_x, 100, 100, 70, 50); //cloud 2
        ellipse(cloud2_x + 50, 100, 90, 50);
        ellipse(cloud2_x - 50, 100, 90, 50);
        ellipse(cloud2_x + 90, 100, 60, 30);
        ellipse(cloud2_x - 90, 100, 60, 30);

        fill(255);
        ellipse(cloud3_x, 60, 100, 70, 50); //cloud 2
        ellipse(cloud3_x + 50, 60, 90, 50);
        ellipse(cloud3_x - 50, 60, 90, 50);
        ellipse(cloud3_x + 90, 60, 60, 30);
        ellipse(cloud3_x - 90, 60, 60, 30);

        //cloud speed
        cloud1_x += 1; 
        cloud2_x -= 1;
        cloud3_x += 1;

        //if cloud exceeds canvas, circle back from the other side
        if (cloud1_x > width + 100) 
        {
            cloud1_x =- 100;
        }
        if (cloud2_x < -100)
        {
            cloud2_x = width;
        }
        if (cloud3_x > width + 100)
        {
            cloud3_x = -100;
        }
    }

    function drawMountains()
    {
        for (var i = 0; i < rightMountainArray.length; i++)
            {
                //right mountain
                fill(140, 109, 98); //base colour
                triangle(rightMountainArray[i], rightMountain.y1, rightMountainArray[i] + 165, rightMountain.y2, rightMountainArray[i] + 348, rightMountain.y3);
                fill(108, 75, 64); //shadow
                triangle(rightMountainArray[i] + 300, rightMountain.y1, rightMountainArray[i] + 165, rightMountain.y2, rightMountainArray[i] + 348, rightMountain.y3);

                fill(255); //snow peaks
                beginShape();
                vertex(rightMountainArray[i] + 118, rightSnowPeak.y1);
                vertex(rightMountainArray[i] + 165, rightSnowPeak.y1 - 70);
                vertex(rightMountainArray[i] + 213, rightSnowPeak.y1 - 5);
                vertex(rightMountainArray[i] + 185, rightSnowPeak.y1 - 25);
                vertex(rightMountainArray[i] + 160, rightSnowPeak.y1 + 2);
                vertex(rightMountainArray[i] + 155, rightSnowPeak.y2);
                endShape(CLOSE);
            }

        for (var i = 0; i < leftMountainArray.length; i++)
            {
                //left mountain 
                fill(140, 109, 98); //base colour
                triangle(leftMountainArray[i], leftMountain.y1, leftMountainArray[i] + 101, leftMountain.y2, leftMountainArray[i] + 270, leftMountain.y3);
                fill(108, 75, 64); //shadow
                triangle(leftMountainArray[i] + 300, leftMountain.y1, leftMountainArray[i] + 101, leftMountain.y2, leftMountainArray[i] + 270, leftMountain.y3);

                fill(255); //snow peaks
                beginShape();
                vertex(leftMountainArray[i] + 60, leftSnowPeak.y1);
                vertex(leftMountainArray[i] + 100, leftSnowPeak.y1 - 69);
                vertex(leftMountainArray[i] + 175, leftSnowPeak.y1 - 3);
                vertex(leftMountainArray[i] + 140, leftSnowPeak.y1 + 20);
                vertex(leftMountainArray[i] + 100, leftSnowPeak.y2);
                endShape(CLOSE);
            }
    }

    function drawTrees()
    {
        for (var i = 0; i < trees_x.length; i++)
        {
            //trees
            fill(160, 82, 45); //tree trunk
            rect(trees_x[i], tree.y, tree.trunkWidth, tree.trunkHeight);

            fill(85, 107, 47); //tree leaves
            ellipse(trees_x[i] + 20, 370, 90, 60);
            ellipse(trees_x[i] + 20, 340, 70, 50);
            ellipse(trees_x[i] + 20, 315, 50, 30);

        }
    }

    function drawMango() 
    {
        for (var i = 0; i < mangoArray.length; i++) 
        {
            if (!mangoArray[i].isFound) 
            {
                var t_mango = mangoArray[i];
                fill(255, 165, 0); // mango body
                ellipse(t_mango.pos_x, t_mango.pos_y, t_mango.width, t_mango.height);

                fill(139, 69, 19); // stem
                rect(t_mango.pos_x - 3, t_mango.pos_y - 27, 5, 18);

                fill(0, 128, 0); // leaf
                push();
                translate(t_mango.pos_x - 7, t_mango.pos_y - 15);
                rotate(-45);
                ellipse(0, 0, 10, 20);
                pop();

                fill(255, 204, 0); // details
                ellipse(t_mango.pos_x, t_mango.pos_y - 3, 3, 6); // top dot
                ellipse(t_mango.pos_x + 5, t_mango.pos_y + 1, 3, 6); // right dot
                ellipse(t_mango.pos_x - 5, t_mango.pos_y + 1, 3, 6); // left dot
                ellipse(t_mango.pos_x, t_mango.pos_y + 4, 3, 6); // bottom dot
            }
        }
    }

    function checkMango(t_mango)
    {
        mangoArray.forEach(mango => {
            if (dist(charPiggy_x, charPiggy_y, mango.pos_x, mango.pos_y) < 40 && mango.isFound == false) {
                mango.isFound = true;
                gameScore += 1;
                collectableSound.play();
            }
        });
    }

    function drawCanyon(t_canyon)
    {
        for (var i = 0; i < canyonArray.length; i++)
            {
                fill(173, 216, 230);
                rect(canyonArray[i], t_canyon.pos_y, t_canyon.width, t_canyon.height);
            }
    }

    function checkCanyon(t_canyon)
    {
        //piggy falls if walks over canyon
        for (var i = 0; i < canyonArray.length; i++)
            {
                if ((charPiggy_x > canyonArray[i] && charPiggy_x < canyonArray[i] + t_canyon.width) && (charPiggy_y > t_canyon.pos_y))
                {
                    isPlummeting = true;
                    charPiggy_y += 5;
                    fallSound.play();
                }
            }
    }

    function drawPiggy()
    {
        //the game character
        if(isLeft && isJumping)
        {
            //jumping-left
            fill(255, 192, 203);
            ellipse(charPiggy_x - 4, charPiggy_y - 65, 7, 15); //ears
            ellipse(charPiggy_x + 4, charPiggy_y - 65, 7, 15);
            ellipse(charPiggy_x, charPiggy_y - 30, 30, 40); //body
            ellipse(charPiggy_x, charPiggy_y - 55, 18, 28); //head 
            fill(255);
            ellipse(charPiggy_x - 4, charPiggy_y - 61, 5, 5); //eyes
            ellipse(charPiggy_x + 4, charPiggy_y - 61, 5, 5);
            fill(0);
            ellipse(charPiggy_x - 5, charPiggy_y - 62, 2, 2); //pupils
            ellipse(charPiggy_x + 3, charPiggy_y - 62, 2, 2); 
            fill(255, 105, 180);
            ellipse(charPiggy_x, charPiggy_y - 53, 12, 10); //nose
            fill(255, 192, 203);
            ellipse(charPiggy_x - 2, charPiggy_y - 54, 3, 4); //nostrils
            ellipse(charPiggy_x + 2, charPiggy_y - 54, 3, 4);
            fill(0);
            arc(charPiggy_x, charPiggy_y - 51, 8, 5, 0, PI); //smile
            fill(205, 133, 163);
            rect(charPiggy_x - 8, charPiggy_y - 20, 5, 10); //legs
            rect(charPiggy_x + 4, charPiggy_y - 14, 5, 10);
            rect(charPiggy_x + 10, charPiggy_y - 40, 3, 10); //arms
            rect(charPiggy_x - 14, charPiggy_y - 50, 3, 10);     
        }
        else if(isRight && isJumping)
        {
            //jumping-right
            fill(255, 192, 203);
            ellipse(charPiggy_x - 4, charPiggy_y - 65, 7, 15); //ears
            ellipse(charPiggy_x + 4, charPiggy_y - 65, 7, 15);
            ellipse(charPiggy_x, charPiggy_y - 30, 30, 40); //body
            ellipse(charPiggy_x, charPiggy_y - 55, 18, 28); //head 
            fill(255);
            ellipse(charPiggy_x - 4, charPiggy_y - 61, 5, 5); //eyes
            ellipse(charPiggy_x + 4, charPiggy_y - 61, 5, 5);
            fill(0);
            ellipse(charPiggy_x - 3, charPiggy_y - 62, 2, 2); //pupils
            ellipse(charPiggy_x + 5, charPiggy_y - 62, 2, 2); 
            fill(255, 105, 180);
            ellipse(charPiggy_x, charPiggy_y - 53, 12, 10); //nose
            fill(255, 192, 203);
            ellipse(charPiggy_x - 2, charPiggy_y - 54, 3, 4); //nostrils
            ellipse(charPiggy_x + 2, charPiggy_y - 54, 3, 4);
            fill(0);
            arc(charPiggy_x, charPiggy_y - 51, 8, 5, 0, PI); //smile
            fill(205, 133, 163);
            rect(charPiggy_x - 8, charPiggy_y - 14, 5, 10); //legs
            rect(charPiggy_x + 4, charPiggy_y - 20, 5, 10);
            rect(charPiggy_x + 10, charPiggy_y - 50, 3, 10); //arms
            rect(charPiggy_x - 14, charPiggy_y - 40, 3, 10);
        }
        else if(isJumping || isPlummeting)
        {
            //jumping facing forwards
            fill(255, 192, 203);
            ellipse(charPiggy_x - 4, charPiggy_y - 65, 7, 15); //ears
            ellipse(charPiggy_x + 4, charPiggy_y - 65, 7, 15);
            ellipse(charPiggy_x, charPiggy_y - 30, 30, 40); //body
            ellipse(charPiggy_x, charPiggy_y - 55, 18, 28); //head 
            fill(255);
            ellipse(charPiggy_x - 4, charPiggy_y - 61, 5, 5); //eyes
            ellipse(charPiggy_x + 4, charPiggy_y - 61, 5, 5);
            fill(0);
            ellipse(charPiggy_x - 3, charPiggy_y - 62, 2, 2); //pupils
            ellipse(charPiggy_x + 3, charPiggy_y - 62, 2, 2); 
            fill(255, 105, 180);
            ellipse(charPiggy_x, charPiggy_y - 53, 12, 10); //nose
            fill(255, 192, 203);
            ellipse(charPiggy_x - 2, charPiggy_y - 54, 3, 4); //nostrils
            ellipse(charPiggy_x + 2, charPiggy_y - 54, 3, 4);
            fill(0);
            arc(charPiggy_x, charPiggy_y - 51, 8, 5, 0, PI); //smile
            fill(205, 133, 163);
            rect(charPiggy_x - 8, charPiggy_y - 16, 5, 10); //legs
            rect(charPiggy_x + 4, charPiggy_y - 16, 5, 10);
            rect(charPiggy_x + 10, charPiggy_y - 50, 3, 10); //arms
            rect(charPiggy_x - 14, charPiggy_y - 50, 3, 10);
        }
        else if(isLeft)
        {
            //walking left
            fill(255, 105, 180);
            rect(charPiggy_x - 10, charPiggy_y - 57, 5, 7); //nose
            fill(255, 192, 203);
            ellipse(charPiggy_x, charPiggy_y - 64, 4, 18); //ears
            ellipse(charPiggy_x, charPiggy_y - 30, 23, 40); //body
            ellipse(charPiggy_x, charPiggy_y - 55, 15, 28); //head 
            fill(255);
            ellipse(charPiggy_x - 3, charPiggy_y - 61, 5, 5); //eyes
            fill(0);
            ellipse(charPiggy_x - 4, charPiggy_y - 61, 2, 2); //pupils
            fill(255, 192, 203);
            ellipse(charPiggy_x - 9, charPiggy_y - 55, 2, 3); //nostrils
            fill(0);
            arc(charPiggy_x - 10, charPiggy_y - 52, 8, 2, 0, QUARTER_PI); //smile
            fill(205, 133, 163);
            rect(charPiggy_x - 3, charPiggy_y - 13, 5, 10); //legs
            rect(charPiggy_x - 2, charPiggy_y - 30, 3, 10); //arms
        }
        else if (isRight)
        {
            //walking right
            fill(255, 105, 180);
            rect(charPiggy_x + 5, charPiggy_y - 57, 5, 7); //nose
            fill(255, 192, 203);
            ellipse(charPiggy_x, charPiggy_y - 65, 4, 15); //ears
            ellipse(charPiggy_x, charPiggy_y - 30, 23, 40); //body
            ellipse(charPiggy_x, charPiggy_y - 55, 15, 28); //head 
            fill(255);
            ellipse(charPiggy_x + 3, charPiggy_y - 61, 5, 5); //eyes
            fill(0);
            ellipse(charPiggy_x + 4, charPiggy_y - 61, 2, 2); //pupils
            fill(255, 192, 203);
            ellipse(charPiggy_x + 9, charPiggy_y - 55, 2, 3); //nostrils
            fill(0);
            arc(charPiggy_x + 6, charPiggy_y - 52, 8, 2, 0, QUARTER_PI); //smile
            fill(205, 133, 163);
            rect(charPiggy_x - 3, charPiggy_y - 13, 5, 10); //legs
            rect(charPiggy_x - 2, charPiggy_y - 30, 3, 10); //arms
        }
        else
        {
            // standing, front facing
            fill(255, 192, 203);
            ellipse(charPiggy_x - 4, charPiggy_y - 65, 7, 15); //ears
            ellipse(charPiggy_x + 4, charPiggy_y - 65, 7, 15);
            ellipse(charPiggy_x, charPiggy_y - 30, 30, 40); //body
            ellipse(charPiggy_x, charPiggy_y - 55, 18, 28); //head 
            fill(255);
            ellipse(charPiggy_x - 4, charPiggy_y - 61, 5, 5); //eyes
            ellipse(charPiggy_x + 4, charPiggy_y - 61, 5, 5);
            fill(0);
            ellipse(charPiggy_x - 3, charPiggy_y - 60, 2, 2); //pupils
            ellipse(charPiggy_x + 3, charPiggy_y - 60, 2, 2); 
            fill(255, 105, 180);
            ellipse(charPiggy_x, charPiggy_y - 53, 12, 10); //nose
            fill(255, 192, 203);
            ellipse(charPiggy_x - 2, charPiggy_y - 54, 3, 4); //nostrils
            ellipse(charPiggy_x + 2, charPiggy_y - 54, 3, 4);
            fill(0);
            arc(charPiggy_x, charPiggy_y - 51, 8, 2, 0, PI);
            fill(205, 133, 163);
            rect(charPiggy_x - 8, charPiggy_y - 13, 5, 10); //legs
            rect(charPiggy_x + 4, charPiggy_y - 13, 5, 10);
            rect(charPiggy_x + 10, charPiggy_y - 30, 3, 10); //arms
            rect(charPiggy_x - 14, charPiggy_y - 30, 3, 10);
        }
    }

    function renderFlagpole()
    {
        if (isReached == false) //flag not raised
            {
                strokeWeight(3);
                stroke(0);
                line(flagpole.pos_x, flagpole.pos_y, flagpole.pos_x, flagpole.pos_y - 100); //flag post
                fill(95,10,100);
                beginShape(); //flag
                vertex(flagpole.pos_x, flagpole.pos_y - 20);
                vertex(flagpole.pos_x + 50, flagpole.pos_y - 20);
                vertex(flagpole.pos_x + 32, flagpole.pos_y - 35);
                vertex(flagpole.pos_x + 50, flagpole.pos_y - 50);
                vertex(flagpole.pos_x, flagpole.pos_y - 50);
                endShape();
            }
        else if (isReached == true) //raise flag
            {
                strokeWeight(3);
                stroke(0);
                line(flagpole.pos_x, flagpole.pos_y, flagpole.pos_x, flagpole.pos_y - 100); //flag post
                fill(95,10,100);
                beginShape(); //flag
                vertex(flagpole.pos_x, flagpole.pos_y - 70);
                vertex(flagpole.pos_x + 50, flagpole.pos_y - 70);
                vertex(flagpole.pos_x + 32, flagpole.pos_y - 85);
                vertex(flagpole.pos_x + 50, flagpole.pos_y - 100);
                vertex(flagpole.pos_x, flagpole.pos_y - 100);
                endShape();
            }
    }

    function checkFlagpole()
    {
            if (dist(charPiggy_x, charPiggy_y, flagpole.pos_x, flagpole.pos_y) < 20)
            {
                isReached = true;
            }
    }

    function checkPiggyDie()
    {
        if (isPlummeting == true && (charPiggy_y > 574 && charPiggy_y < 590))
            {
                lives -= 1;
                if (lives > 0)
                    {
                        startGame();
                        isPlummeting = false;
                    }

            }
    }

    function createPlatforms(x, y, length)
    {
        var p = 
            {
                x: x,
                y: y,
                length: length,
                draw: function()
                {
                    stroke(255);
                    fill(205,92,92);
                    rect(this.x, this.y, this.length, 20);
                },
                checkContact: function(gc_x, gc_y)
                {
                    if (gc_x > this.x && gc_x < this.x + this.length)
                        {
                            console.log("inline");
                            var d = this.y - gc_y;
                            if (d >= 0 && d < 20)
                                {
                                    return true;
                                }
                        }

                    return false;
                }
            }

        return p;
    }

    function Enemy(x, y, range)
    {
        this.x = x;
        this.y = y;
        this.range = range;

        this.currentX = x;
        this.inc = 1;

        this.update = function()
        {
            this.currentX += this.inc;

            if (this.currentX >= this.x + this.range)
                {
                    this.inc = -1;
                }
            else if (this.currentX < this.x)
                {
                    this.inc = 1;
                }
        }

        this.draw = function()
        {
            this.update();
            strokeWeight(0.5);
            fill(255,228,196)

            push(); //wings
            translate(this.currentX - 15, this.y - 15);
            rotate(-35);
            ellipse(0, 0, 10, 27);
            pop();
            push(); //wings
            translate(this.currentX - 6, this.y - 20);
            rotate(28);
            ellipse(0, 0, 10, 27);
            pop();

            fill(143,188,143);
            ellipse(this.currentX, this.y, 35, 35); //fly body
            fill(0);
            ellipse(this.currentX + 3, this.y - 7, 4, 6); //left eye
            ellipse(this.currentX + 9, this.y - 7, 4, 6); //right eye
            fill(255);
            ellipse(this.currentX + 3, this.y - 7, 3, 4); //left pupil
            ellipse(this.currentX + 9, this.y - 7, 3, 4); //right pupil
            fill(0);
            rect(this.currentX - 7, this.y, 20, 9); //mouth
            fill(255); //teeth
            rect(this.currentX - 7, this.y, 5, 4);
            rect(this.currentX - 4, this.y, 5, 4);
            rect(this.currentX - 1, this.y, 5, 4); 
            rect(this.currentX + 2, this.y, 5, 4); 
            rect(this.currentX + 5, this.y, 5, 4);
            rect(this.currentX + 8, this.y, 5, 4);
        }

        this.checkContact = function(gc_x, gc_y)
        {
            var d = dist(gc_x, gc_y, this.currentX, this.y);

            if (d < 30)
                {
                    return true;
                }
            return false;
        }
    }