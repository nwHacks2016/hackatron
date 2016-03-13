Hackatron = {
};

Hackatron.Game = function(game) {
    this.enemy = null;
    this.hostId = null;
    this.player = null;
    this.playerId = null;
    this.blockList = [];
    this.playerList = null;
};

var PLAYER_SPEED = 200;
var currentPath;
var currentPathIndex = 0;

function generateId() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}


Hackatron.Game.prototype = {
    preload: function() {
    },

    toggleFullscreen: function() {
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        if (this.game.scale.isFullScreen) {
            this.game.scale.stopFullScreen();
        } else {
            this.game.scale.startFullScreen();
        }
    },

    getValidCoord: function(x, y) {
        var coord = null;

        while (!coord) {
            var x = this.game.rnd.integerInRange(0, 31);
            var y = this.game.rnd.integerInRange(0, 31);
            // mapData goes top to down and left to right
            var cell = this.mapData[y][x].index;

            //console.log(cell);

            if (cell === Hackatron.mapConfig.floorTile) {
                coord = {x: x, y: y};
            }
        }

        //console.log(coord);

        return coord;
    },

    create: function() {
        this.playerId = generateId();
        this.hostId = this.playerId;
        this.playerList = {};
        this.socket = io.connect();

        this.initPhysics();
        this.initMap();
        this.initPlayer();
        this.initEnemy();
        this.initAI();
        this.initPowerUps();
        this.initCountdown();
        this.initSFX();
        this.initHotkeys();

        // Register to listen to events and inform
        // other players that you have joined the game
        this.registerToEvents();
        this.joinGame();
    },

    initPhysics: function() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
    },

    initHotkeys: function() {
        this.fullscreenKey = this.game.input.keyboard.addKey(Phaser.Keyboard.F);
        this.fullscreenKey.onDown.add(this.toggleFullscreen, this);
    },

    initAI: function() {
        this.ai = new AI();
        this.ai.init(this.mapData);
    },

    initEnemy: function() {
        // Create enemy for the host
        if (!this.enemy) {
            spawnPosY = 20;
            spawnPosX = 512 - 40;
            var enemyParams = {
                game: this.game,
                speed: PLAYER_SPEED,
                characterKey: 'ghost',
                emitterKey: 'poop',
                x: spawnPosX,
                y: spawnPosY,
                keys: {
                    up: Phaser.Keyboard.W,
                    down: Phaser.Keyboard.S,
                    left: Phaser.Keyboard.A,
                    right: Phaser.Keyboard.D
                }
            };
            var enemy = new Ghost();
            enemy.init(enemyParams);
            this.enemy = enemy;
        }
    },

    initPlayer: function() {
        // Create player
        var player = new Tron();
        var spawnPosX = 20;
        var spawnPosY = 20;
        var playerParams = {
            game: this.game,
            characterKey: 'tron',
            emitterKey: 'blueball',
            speed: PLAYER_SPEED,
            x: spawnPosX,
            y: spawnPosY,
            keys: {
                up: Phaser.Keyboard.UP,
                down: Phaser.Keyboard.DOWN,
                left: Phaser.Keyboard.LEFT,
                right: Phaser.Keyboard.RIGHT,
                att: Phaser.Keyboard.SPACEBAR
            }
        };
        player.init(playerParams);
        player.setName(this, Hackatron.playerName);
        this.player = player;
    },

    initMap: function() {
        this.map = this.add.tilemap('tilesetMap');
        this.map.addTilesetImage(Hackatron.mapConfig.tilesetKey, 'tilesetImage');

        this.mapData = this.map.layers[0].data;

        this.layer = this.map.createLayer('Base');
        this.layer.resizeWorld();

        // Collision
        this.game.physics.arcade.enable(this.layer);

        var nonGroundTilesMap = {};
        var nonGroundTiles = [];

        this.mapData.forEach(function(column) {
            column.forEach(function(cell) {
                if (cell.index !== Hackatron.mapConfig.floorTile) {
                    nonGroundTilesMap[cell.index] = true;
                }
            });
        });

        for (index in nonGroundTilesMap) {
            nonGroundTiles.push(parseInt(index));
        }

        this.map.setCollision(nonGroundTiles);
    },

    initCountdown: function() {
        var countdown = new Countdown();
        countdown.init(this.game);
        countdown.start();
    },

    initSFX: function() {
        // var fx = this.game.add.audio('sfx');
        // fx.addMarker('monsterRoar', 2, 1.2);
        // fx.addMarker('playerEaten', 5, 0.5);
        // fx.addMarker('playerInWater', 7, 0.5);
        // fx.addMarker('jump', 0, 0.24);
    },

    initPowerUps: function() {
        this.powerups = [];
        this.powerupPlugins = ['speedBoost', 'portal', 'reverseMode', 'invincibleMode', 'rageMode']; // 'ghostMode', 'saiyanMode'];

        setInterval(function() {
            this.powerups = this.powerups.filter(function(powerup) {
                if (!powerup.ended) {
                    return powerup;
                }
            });

            var randomPlugin = this.powerupPlugins[this.game.rnd.integerInRange(0, this.powerupPlugins.length-1)];
            var powerup = new Powerup();
            powerup.init({handler: Powerup.plugins[randomPlugin], game: this.game, map: this.mapData, player: this.player});

            this.powerups.push(powerup);
        }.bind(this), 1000);
    },

    // TODO: causing some errors, not sure why
    createExplodingParticles: function(sprite, cb) {
        var self = this;

        // create a Phaser.Group for all the particles of the explosion
        self.explodingGroup = self.game.add.group();
        self.explodingGroup.enableBody = true;
        self.explodingGroup.physicsBodyType = Phaser.Physics.ARCADE;
        var colors = ['#77DD77', '#B39EB5', '#C23B22', '#FFB347', '#FDFD96', '#836953', '#779ECB', '#FFD1DC'];

        // create a black square as gfx for the particles
        var explodingRect = self.game.make.bitmapData(5, 5);
        explodingRect.ctx.fillStyle = colors[self.game.rnd.integerInRange(0, colors.length-1)];
        explodingRect.ctx.fillRect(0, 0, 5, 5);

        var explodingSprite = new Phaser.Sprite(self.game, sprite.x, sprite.y, explodingRect);
        self.explodingGroup.add(explodingSprite);

        explodingSprite = new Phaser.Sprite(self.game, sprite.x, sprite.y, explodingRect);
        self.explodingGroup.add(explodingSprite);

        // setup the animation for the particles. make them "jump" by setting a negative velocity
        // and set timeout to make the blink before being finally destroyed
        self.explodingGroup.forEach(function (sprite) {
            sprite.body.gravity.y = 35;
            sprite.body.velocity.setTo(self.game.rnd.integerInRange(-20, 20), self.game.rnd.integerInRange(-35, -50));

            setTimeout(function () {
                sprite.visible = false;
                setTimeout(function () {
                    sprite.visible = true;
                    setTimeout(function () {
                        sprite.destroy();
                        cb && cb();
                    }, 100);
                }, 100);
            }, 10);
        });
    },
    update: function() {
        // this === Hackatron.Game
        var self = this;
        if (!self.player || !self.enemy) return;

        var collisionHandler = function() {
            // this === Phaser.Game
            if (self.player.invincible) { return; }

            self.player.kill();

            //self.game.fx.play('monsterRoar');
            
            self.createExplodingParticles(self.player.sprite, function() {
                self.socket.emit('tronKilled', JSON.stringify({
                    killedTronId: self.playerId
                }));

                self.enemy.updatePoints(self.player.points);
                self.player.sprite.emitter.destroy();
                self.player.nameText.destroy();
                self.player.sprite.destroy();
            });
            // //enemy.stopPathFinding;
            // var rebootGhost= function() {
            //     //enemy.startPathFinding;
            // };
            //
            // self.game.time.events.add(Phaser.Timer.SECOND * 2, rebootGhost, this);
        };

        var portalTransition = function() {
            self.player.teleport(self.portal.exitPortal);
        };

        var ghostDirection = self.enemy.updatePos();
        var playerDirection = self.player.updatePos();
        var block = self.player.triggerAttack(self.blockList);

        if (block !== null) {
            self.socket.emit('blockSpawned', JSON.stringify ({
                x: block.x,
                y: block.y
            }));

            self.blockList.push(block);
        }

        // Check for collisions
        self.game.physics.arcade.collide(self.player.sprite, self.layer);
        self.game.physics.arcade.collide(self.enemy.sprite, self.layer);
        self.game.physics.arcade.overlap(self.enemy.sprite, self.player.sprite, collisionHandler, null, self.game);

        self.powerups.forEach(function(powerup) {
            powerup.update();
        });

        self.blockList.forEach(function(block) {
            console.log(block);
            self.game.physics.arcade.collide(self.player.sprite, block);
        });

        // Sanitize coords
        if (this.player.sprite.y < 16) {
            this.player.sprite.y = 16;
        }

        if (this.player.sprite.y > this.game.world.height - 16) {
            this.player.sprite.y = this.game.world.height - 16;
        }

        if (this.player.sprite.x < 0) {
            this.player.sprite.x = 0;
        }

        if (this.player.sprite.x > this.game.world.width) {
            this.player.sprite.x = 0;
        }

        var clientInfo = {
            playerId: self.playerId,
            playerPos: {
                posX: self.player.sprite.x,
                posY: self.player.sprite.y,
                direction: playerDirection
            }
        };

        if (self.playerId === self.hostId) {
            clientInfo.enemyPos = {
                posX: self.enemy.sprite.x,
                posY: self.enemy.sprite.y
            };
        }
        self.socket.emit('updateClientPosition', JSON.stringify(clientInfo));
    },

    pelletHelper: function(mapArray){
//        var pelletArr = [];
        var x = 0;
        var y = 0;
        var pos = 1;
        for (pos = 1; pos < mapArray.length ; pos++) {
            if (pos % 32 === 0) {
                x = 0;
                y++;
            }
            else {
                x++;
            }
            if (mapArray[pos] === 0) {
                var pellet = this.add.sprite(x*16+2, y*16+2, 'pellet');
                pellet.scale.x = 0.005;
                pellet.scale.y = 0.005;
            }
        }
    },

// ============================================================================
//                          Socket Event Handlers
// ============================================================================
    registerToEvents: function () {
        var self = this;

        // Method for updating board local client game state using clientInfo
        // broadcasted to all players. The clientInfo variable contains the
        // following keys:
        // {playerId, playersPos: {posX, posY, direction}, enemyPos: {posX, posY}}
        self.socket.on('updateClientPosition', function(clientInfo) {
            clientInfo = JSON.parse(clientInfo);

            var player;
            var playerId = clientInfo.playerId;
            var playerPos = clientInfo.playerPos;
            if (!self.playerList[clientInfo.playerId]) {
                player = new Tron();
                var playerParams = {
                    game: self.game,
                    characterKey: 'tron',
                    emitterKey: 'blueball',
                    speed: PLAYER_SPEED,
                    x: playerPos.posX,
                    y: playerPos.posY
                };
                player.init(playerParams);
                player.setName(self, clientInfo.playerId.substring(0,2));
                self.playerList[clientInfo.playerId] = {'player': player};
            } else {
                player = self.playerList[clientInfo.playerId].player;
            }

            // self.game.physics.arcade.collide(player.sprite, self.layer);
            // self.game.physics.arcade.collide(player.sprite, self.player.sprite, null, null, self.game);

            if(player.sprite.body) {
                player.sprite.body.velocity.x = 0;
                player.sprite.body.velocity.y = 0;
                player.sprite.animations.play(playerPos.direction, 3, false);
                player.sprite.emitter.on = true;
                switch(playerPos.direction) {
                    case 'walkUp':
                        // player.sprite.body.velocity.y = -PLAYER_SPEED;
                        player.sprite.emitter.x = player.sprite.x + 15;
                        player.sprite.emitter.y = player.sprite.y + 35;
                        break;

                    case 'walkDown':
                        // player.sprite.body.velocity.y = PLAYER_SPEED;
                        player.sprite.emitter.x = player.sprite.x + 15;
                        player.sprite.emitter.y = player.sprite.y + -5;
                        break;

                    case 'walkLeft':
                        // player.sprite.body.velocity.x = -PLAYER_SPEED;
                        player.sprite.emitter.x = player.sprite.x + 30;
                        player.sprite.emitter.y = player.sprite.y + 15;
                        break;

                    case 'walkRight':
                        // player.sprite.body.velocity.x = PLAYER_SPEED;
                        player.sprite.emitter.x = player.sprite.x;
                        player.sprite.emitter.y = player.sprite.y + 15;
                        break;
                   default:
                        player.sprite.emitter.on = false;
                        break;
                }
            }

            if (self.playerId !== self.hostId) {
                var enemyPos = clientInfo.enemyPos;
                self.enemy.sprite.x = enemyPos.posX;
                self.enemy.sprite.y = enemyPos.posY;
            }

            player.sprite.x = playerPos.posX;
            player.sprite.y = playerPos.posY;

        });
        // When new player joins, host shall send them data about the 'enemyPos'
        self.socket.on('newPlayer', function(playerInfo) {
            playerInfo = JSON.parse(playerInfo);

            if (self.playerId === self.hostId) {
                var gameData = {
                    playerId: playerInfo.playerId,
                    hostId: self.hostId,
                    enemy: {
                        posX: self.enemy.sprite.x,
                        posY: self.enemy.sprite.y
                    }
                };
                self.socket.emit('welcomePlayer', JSON.stringify(gameData));
            }
        });

        // Set up game state as a new player receiving game data from host
        self.socket.on('welcomePlayer', function(gameData) {
            gameData = JSON.parse(gameData);

            if (self.playerId === gameData.playerId) {
                self.hostId = gameData.hostId;

                if (self.enemy) {
                    self.enemy.sprite.emitter.destroy();
                    self.enemy.sprite.destroy();
                }

                // Create a ghost
                var enemy = new Ghost();
                var enemyParams = {
                    game: self.game,
                    speed: PLAYER_SPEED,
                    characterKey: 'ghost',
                    emitterKey: 'poop',
                    x: gameData.enemy.posX,
                    y: gameData.enemy.posY
                };
                enemy.init(enemyParams);
                self.enemy = enemy;
            }
        });

       // Method for handling received deaths of other clients
        self.socket.on('tronKilled', function(eventInfo) {
            eventInfo = JSON.parse(eventInfo);
            var player = self.playerList[eventInfo.killedTronId].player;
            if(self.enemy && player) {
                self.enemy.killTron(player);
            }
        });

        // Method for handling spawned blocks from other players
        self.socket.on('blockSpawned', function(blockPos) {
            blockPos = JSON.parse(blockPos);

            var block = self.game.add.sprite(blockPos.x, blockPos.y, this.game.add.bitmapData(16, 16));
            block.key.copyRect('powerups', getRect(5, 4), 0, 0);
            self.game.physics.arcade.enable(block, Phaser.Physics.ARCADE);
            block.scale.x = 0.8;
            block.scale.y = 0.8;
            block.body.immovable = true;

            // Make block fade in 2.0 seconds
            this.game.add.tween(block).to( { alpha: 0 }, 2000, "Linear", true, 0, -1);

            self.blockList.push(block);
            setTimeout(function() {
                self.blockList = self.blockList.filter(function(b) {
                    return (b !== block);
                });

                block.destroy();
            }, 2000);
        });
    },

    // Method to broadcast to  other clients (if there are any) that you have
    // joined the game
    joinGame: function () {
        this.socket.emit('newPlayer', JSON.stringify({
            playerId: this.playerId,
            message: this.playerId + ' has joined the game!'
        }));
    }
};
