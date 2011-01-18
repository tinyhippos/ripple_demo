var game = (function ($) {

    var _world = {
            field: {
                hearts: [],
                items: [],
                traps: [],
                position: {
                    top: 160,
                    bottom: 445,
                    left: 20,
                    right: 310
                },
                size: 0,
                bg: null,
                element: null,
                edge: null
            },
            hero: {
                x: 0,
                y: 0,
                element: null,
                HP: 5,
                damageDur: 0,
                speed: 18
            },
            state: {
                level: 0,
                gameOver: false,
                scoreElement: null,
                goal: 0,
                goalCount: 0
            },
            config: {
                spriteSize: 48,
                screenSize: 280,
                levelBg: ['', '#fff', '#b1d1e0', '#b0d4a0', '#d4b597', '#666']
            }
        };
    

    function preventBehavior(e) { 
        e.preventDefault();
    }
        
    function updateUI() {
        var left, top; 
        if (_world.hero.x > _world.field.size / 2) {
            left = Math.min(_world.field.size - _world.hero.x - 280 - 120, -280);
        }
        else if (_world.hero.x < _world.field.size / 2) {
            left = Math.max(-_world.hero.x - 160, -280);
        }
        
        if (_world.hero.y > _world.field.size / 2) {
            top = Math.min(_world.field.size - _world.hero.y - 280 - 120, -280);
        }
        else if (_world.hero.y < _world.field.size / 2) {
            top = Math.max(-_world.hero.y - 140, -280);
        }
        
        _world.field.edge.style.backgroundPosition = left + 'px ' + top + 'px';
        
        _world.state.scoreElement.innerHTML = _world.state.goal + '/' + _world.state.goalCount;
        
        _world.hero.HP = Math.min(_world.hero.HP, 5);
        
        document.getElementById('hp1').style.opacity = _world.hero.HP;
        document.getElementById('hp2').style.opacity = _world.hero.HP - 1;
        document.getElementById('hp3').style.opacity = _world.hero.HP - 2;
        document.getElementById('hp4').style.opacity = _world.hero.HP - 3;
        document.getElementById('hp5').style.opacity = _world.hero.HP - 4;        
        
        if (_world.hero.HP <= 0) {
            document.getElementById('info').innerHTML = 'GAMEOVER'; 
            _world.state.gameOver = true;
        }
    }

    function adjustAlpha(target, cx, cy) {
        var xmin = _world.config.spriteSize / 2 - 7,
            xmax = _world.config.screenSize - _world.config.spriteSize / 2 + 5,
            ymin = _world.config.spriteSize / 2,
            ymax = _world.config.screenSize - _world.config.spriteSize / 2 + 5,
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
        var test = _world.field.size / 2 + _world.config.screenSize / 2,
            value = Math.random() * (_world.field.size) + _world.config.screenSize / 2;

        if (value > test - 30 && value < test + 30) {
            return getRandom();
        }
        else {
            return value;
        }
    }

    function randomPlacement(className, dataArray, len) {
        var i, element, pos;

        for (i = 0; i < len; i++) {
            element = document.createElement('div');
            pos = {
                x: getRandom(),
                y: getRandom(),
                id:  className + i.toString()
            };

            element.className = className;
            element.id = pos.id;
            _world.field.element.appendChild(element);
            dataArray[i] = pos;
        }
    }

    function generateLevel(level) {
        _world.field.size = level * 500 + 500;
        _world.hero.x = _world.field.size / 2;
        _world.hero.y = _world.field.size / 2;
        _world.state.goalCount = level * 10;
        
        var heartNum = 10,
            trapNum = 5 + 30 * level + 20 * (level - 1),
            itemNum = 15 + 10 * level;
        
        randomPlacement('heart', _world.field.hearts, heartNum);
        randomPlacement('trap', _world.field.traps, trapNum);
        randomPlacement('item', _world.field.items, itemNum);
        
        updateSprites();
        updateUI();
        _world.field.bg.style.backgroundColor = _world.config.levelBg[level];
    }
    
    function checkCollision(target, cx, cy) {
        var type = target.id.slice(0, 3),
            centerX = 140,
            centerY = 140;

        if (cx > centerX - 30 && 
            cx < centerX + 30 && cy > centerY - 30 && cy < centerY + 30) {
            
            if (type === 'hea') {
                _world.field.hearts[parseInt(target.id.slice(5, target.id.length), 10)].x = -1000;
                _world.hero.HP++;
            }
            else if (type === 'ite') {
                _world.field.items[parseInt(target.id.slice(4, target.id.length), 10)].x = -1000;
                _world.state.goal++;
                if (_world.state.goal >= _world.state.goalCount) {   
                    _world.state.level++;
                    generateLevel(_world.state.level);
                    _world.state.goal = 0;
                    navigator.notification.blink(4, 0xffffff);
                }
            }
            else if (type === 'tra' && _world.hero.damageDur === 0) {
                navigator.notification.vibrate(250);
                _world.hero.damageDur = 20;
                _world.hero.HP--;
            }
        }
    }

    function updateCoordinates(target, x, y) {
        target.style.left = (_world.field.position.left + x - _world.config.spriteSize / 2).toString() + 'px';
        target.style.top = (_world.field.position.top + y - _world.config.spriteSize / 2).toString() + 'px';
        adjustAlpha(target, x, y);
        checkCollision(target, x, y);
    }
    
    function updateMultipleSpriteCoordinates(sprites) {
        var i, sprite, element;

        for (i = 0; i < sprites.length; i++) {
            sprite = sprites[i];
            element = document.getElementById(sprite.id);
            updateCoordinates(element, (-_world.hero.x + sprite.x), (-_world.hero.y + sprite.y));
        }
    }

    function updateSprites() {
        _world.field.bg.style.backgroundPosition =  (-_world.hero.x + _world.field.position.left).toString() + 'px ' + (-_world.hero.y + _world.field.position.top).toString() + 'px';
        updateMultipleSpriteCoordinates(_world.field.hearts);
        updateMultipleSpriteCoordinates(_world.field.traps);
        updateMultipleSpriteCoordinates(_world.field.items);
    }
        
    return {
        init: function () {
            document.addEventListener("touchmove", preventBehavior, false);
            _world.hero.element = document.getElementById('hero');
            _world.field.bg = document.getElementById('container');
            _world.field.element = document.getElementById('actionLayer');
            _world.state.scoreElement = document.getElementById('score');
            _world.field.edge = document.getElementById('edge');
            _world.hero.element.style.left = (_world.field.position.left + _world.config.screenSize / 2 - _world.config.spriteSize / 2).toString() + 'px';
            _world.hero.element.style.top = (_world.field.position.top + _world.config.screenSize / 2 - _world.config.spriteSize / 2).toString() + 'px';
            _world.state.level = 1;  
            
            generateLevel(_world.state.level);
        },

        watchAccel: function () {
            var suc = function (accel) {
            
                if (_world.state.gameOver) {
                    return;
                }

                var o = Math.round(accel.y * 1000),
					a = Math.round(accel.x * 1000),
                    rad = Math.atan2(a, o);
                
                _world.hero.x += accel.x * _world.hero.speed;
                _world.hero.y -= accel.y * _world.hero.speed;
                            
                if (_world.hero.y > _world.field.size) {
                    _world.hero.y = _world.field.size;
                }
                if (_world.hero.y < 0) {
                    _world.hero.y = 0;
                }
                if (_world.hero.x > _world.field.size) {
                    _world.hero.x = _world.field.size;
                }
                if (_world.hero.x < 0) {
                    _world.hero.x = 0;
                }
                
                rad = (180 / Math.PI) * rad;
                
                if (rad < 67.5 && rad >= 0 || rad > -67.5 && rad < 0) {
                    _world.hero.element.className = 'heroB';
                }
                else if (rad >= 67.5 && rad < 112.5) {
                    _world.hero.element.className = 'heroR';
                }
                else if (rad < -67.5 && rad > -112.5) {
                    _world.hero.element.className = 'heroL';
                }
                else if (rad >= 112.5 && rad < 157.5) {
                    _world.hero.element.className = 'heroFR';
                }
                else if (rad <= -112.5 && rad > -157.5) {
                    _world.hero.element.className = 'heroFL';
                }
                else {
                    _world.hero.element.className = 'heroF';
                }
                
                
                updateSprites();
                updateUI();
                
                if (_world.hero.damageDur > 0) {
                    _world.hero.damageDur--;
                }
	
            },
            fail = function () {},
            opt = {frequency: 50},
			timer;

            timer = navigator.accelerometer.watchAcceleration(suc, fail, opt);
        }
    };

}(window));
