var Game = (function ($) {

    var size = 48,
        fieldSize,
        level,
        rad = 25,
        topPosition = 160,
        bottomPosition = 445,
        leftPosition = 20,
        rightPosition = 310,
        screenSize = 280,
    
        y,
        x,
    
        min = 0,
        max,
    
        colorArray = ['', '#fff', '#b1d1e0', '#b0d4a0', '#d4b597', '#666'],
    
        multiplier = 18,
    
        hero,
        heroHP = 5,
    
        bg,
        main,
        edge,
        damageDur = 0,
    
        score,
        goalCount,
        goal = 0,
    
        heart = [],
        heartData = [],
    
        item = [],
        itemData = [],
    
        trap = [],
        trapData = [],
    
        gameOver = false,

        preventBehavior = function (e) { 
            e.preventDefault();
        };
        
    function updateUI() {
        var left, top; 
        if (x > fieldSize / 2) {
            left = Math.min(fieldSize - x - 280 - 120, -280);
        }
        else if (x < fieldSize / 2) {
            left = Math.max(-x - 160, -280);
        }
        
        if (y > fieldSize / 2) {
            top = Math.min(fieldSize - y - 280 - 120, -280);
        }
        else if (y < fieldSize / 2) {
            top = Math.max(-y - 140, -280);
        }
        
        edge.style.backgroundPosition = left + 'px ' + top + 'px';
        
        score.innerHTML = goal + '/' + goalCount;
        
        heroHP = Math.min(heroHP, 5);
        
        document.getElementById('hp1').style.opacity = heroHP;
        document.getElementById('hp2').style.opacity = heroHP - 1;
        document.getElementById('hp3').style.opacity = heroHP - 2;
        document.getElementById('hp4').style.opacity = heroHP - 3;
        document.getElementById('hp5').style.opacity = heroHP - 4;        
        
        if (heroHP <= 0) {
            document.getElementById('info').innerHTML = 'GAMEOVER'; 
            gameOver = true;
        }
    }

    function adjustAlpha(target, cx, cy) {
        var xmin = size / 2 - 7,
            xmax = screenSize - size / 2 + 5,
            ymin = size / 2,
            ymax = screenSize - size / 2 + 5,
            alpha = 1,
            dist = 18;
        
        if (cx < xmin) {
            alpha = Math.min(cx / dist, alpha);
        }

        if (cx > xmax) {
            alpha = Math.min((xmax + dist - cx) / dist, alpha);
        }
        if (cy < ymin) {
            alpha = Math.min((cy - ymin + dist) / dist, alpha);
        }
        if (cy > ymax) {
            alpha = Math.min((ymax + dist - cy) / dist, alpha);
        }
                
        target.style.display = alpha <= 0 ? 'none' : 'inherit';
        target.style.opacity = alpha;
    }
    
    function getRandom() {
        var test = fieldSize / 2 + screenSize / 2,
            value = Math.random() * (fieldSize) + screenSize / 2;

        if (value > test - 30 && value < test + 30) {
            return getRandom();
        }
        else {
            return value;
        }
    }

    function randomPlacement(className, array, dataArray, len) {
        var i, element, x, y, id;

        for (i = 0; i < len; i++) {
            element = document.createElement('div');
            x = getRandom();
            y = getRandom();
            id =  className + i.toString();

            element.className = className;
            element.id = id;
            main.appendChild(element);
            array[i] = id;
            dataArray[i] = [x, y];
        }
    }

    function generateLevel(level) {
        fieldSize = level * 500 + 500;
        max = fieldSize;
        x = fieldSize / 2;
        y = fieldSize / 2;
        goalCount = level * 10;
        
        var heartNum = 10,
            trapNum = 5 + 30 * level + 20 * (level - 1),
            itemNum = 15 + 10 * level;
        
        randomPlacement('heart', heart, heartData, heartNum);
        randomPlacement('trap', trap, trapData, trapNum);
        randomPlacement('item', item, itemData, itemNum);
        
        updateSprites();
        updateUI();
        bg.style.backgroundColor = colorArray[level];
    }
    
    function checkCollision(target, cx, cy) {
        var type = target.id.slice(0, 3),
            centerX = 140,
            centerY = 140;

        if (cx > centerX - 30 && 
            cx < centerX + 30 && cy > centerY - 30 && cy < centerY + 30) {
            
            if (type === 'hea') {
                heartData[parseInt(target.id.slice(5, target.id.length), 10)][0] = -1000;
                heroHP++;
            }
            else if (type === 'ite') {
                itemData[parseInt(target.id.slice(4, target.id.length), 10)][0] = -1000;
                goal++;
                if (goal >= goalCount) {   
                    level++;
                    generateLevel(level);
                    goal = 0;
                    navigator.notification.blink(4, 0xffffff);
                }
            }
            else if (type === 'tra' && damageDur === 0) {
                navigator.notification.vibrate(250);
                damageDur = 20;
                heroHP--;
            }
        }
    }

    function updateCoordinates(target, x, y) {
        target.style.left = (leftPosition + x - size / 2).toString() + 'px';
        target.style.top = (topPosition + y - size / 2).toString() + 'px';
        adjustAlpha(target, x, y);
        checkCollision(target, x, y);
    }
    
    function updateMultipleSpriteCoordinates(array, dataArray) {
        var i, id, element, cx, cy;

        for (i = 0; i < array.length; i++) {
            id = array[i];
            element = document.getElementById(id);
            cx = dataArray[i][0];
            cy = dataArray[i][1];
            updateCoordinates(element, (-x + cx), (-y + cy));
        }
    }

    function updateSprites() {
        bg.style.backgroundPosition =  (-x + leftPosition).toString() + 'px ' + (-y + topPosition).toString() + 'px';
        updateMultipleSpriteCoordinates(heart, heartData);
        updateMultipleSpriteCoordinates(trap, trapData);
        updateMultipleSpriteCoordinates(item, itemData);
    }
        
    return {
        init: function () {
            document.addEventListener("touchmove", preventBehavior, false);
            hero = document.getElementById('hero');
            bg = document.getElementById('container');
            main = document.getElementById('actionLayer');
            score = document.getElementById('score');
            edge = document.getElementById('edge');
            hero.style.left = (leftPosition + screenSize / 2 - size / 2).toString() + 'px';
            hero.style.top = (topPosition + screenSize / 2 - size / 2).toString() + 'px';
            level = 1;  
            
            generateLevel(level);
        },

        watchAccel: function () {
            var suc = function (accel) {
            
                if (gameOver === true) {
                    return;
                }

                var o = Math.round(accel.y * 1000),
					a = Math.round(accel.x * 1000),
                    rad = Math.atan2(a, o);
                
                x += accel.x * multiplier;
                y -= accel.y * multiplier;
                            
                if (y > max) {
                    y = max;
                }
                if (y < min) {
                    y = min;
                }
                if (x > max) {
                    x = max;
                }
                if (x < min) {
                    x = min;
                }
                
                rad = (180 / Math.PI) * rad;
                
                if (rad < 67.5 && rad >= 0 || rad > -67.5 && rad < 0) {
                    hero.className = 'heroB';
                }
                else if (rad >= 67.5 && rad < 112.5) {
                    hero.className = 'heroR';
                }
                else if (rad < -67.5 && rad > -112.5) {
                    hero.className = 'heroL';
                }
                else if (rad >= 112.5 && rad < 157.5) {
                    hero.className = 'heroFR';
                }
                else if (rad <= -112.5 && rad > -157.5) {
                    hero.className = 'heroFL';
                }
                else {
                    hero.className = 'heroF';
                }
                
                
                updateSprites();
                updateUI();
                
                if (damageDur > 0) {
                    damageDur--;
                }
	
            },
            fail = function () {},
            opt = {frequency: 50},
			timer;

            timer = navigator.accelerometer.watchAcceleration(suc, fail, opt);
        }
    };

}(window));
