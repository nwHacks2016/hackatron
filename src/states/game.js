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
        this.playerList = {};
        this.socket = io.connect();
        this.events = [];

        this.initPhysics();
        this.initMap();
        this.initPlayer();
        this.initCountdown();
        this.initSFX();
        this.initHotkeys();
        this.initPowerUps();

        // Register to listen to events and inform
        // other players that you have joined the game
        this.registerToEvents();
        this.joinGame();

        this.initEvents();
    },

    initEvents: function() {
        var self = this;

        setInterval(this.broadcastEvents.bind(this), 50);

        // Send player position every 50ms
        setInterval(function() {
            var playerDirection = self.player.updatePos();

            if (!self.player.dirty) { return; }

            self.player.dirty = false;

            var info = {
                playerId: self.playerId,
                playerPos: {
                    posX: self.player.sprite.x,
                    posY: self.player.sprite.y,
                    direction: playerDirection
                }
            };

            self.addEvent({key: 'updatePlayer', info: info});
        }, 100);

        if (self.playerId === self.hostId) {
            // Send enemy position every 50ms
            setInterval(function() {
                var ghostDirection = self.enemy.updatePos();

                if (!self.enemy.dirty) { return; }

                self.enemy.dirty = false;

                var info = {
                    enemyPos: {
                        posX: self.enemy.sprite.x,
                        posY: self.enemy.sprite.y,
                        direction: ghostDirection
                    }
                };

                self.addEvent({key: 'updateEnemy', info: info});
            }, 50);
        }
    },

    initPhysics: function() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
    },

    initHotkeys: function() {
        this.fullscreenKey = this.game.input.keyboard.addKey(Phaser.Keyboard.F);
        this.fullscreenKey.onDown.add(this.toggleFullscreen, this);
    },

    runAiSystem: function() {
        this.ai = new AI();
        this.ai.init(this.game, this.player, this.enemy, this.playerId, this.hostId, this.mapData);
    },

    runEnemySystem: function() {
        // Create enemy for the host
        if (!this.enemy) {
            var coord = this.getValidCoord();

            var enemyParams = {
                game: this.game,
                speed: PLAYER_SPEED,
                characterKey: 'ghost',
                emitterKey: 'poop',
                x: coord.x * 16,
                y: coord.y * 16,
                keys: {
                    up: Phaser.Keyboard.W,
                    down: Phaser.Keyboard.S,
                    left: Phaser.Keyboard.A,
                    right: Phaser.Keyboard.D
                }
            };

            this.enemy = new Ghost();
            this.enemy.init(enemyParams);
        }
    },

    initPlayer: function() {
        this.player = new Tron();

        var coord = this.getValidCoord();

        var playerParams = {
            game: this.game,
            characterKey: 'tron',
            emitterKey: 'blueball',
            speed: PLAYER_SPEED,
            x: coord.x * 16,
            y: coord.y * 16,
            keys: {
                up: Phaser.Keyboard.UP,
                down: Phaser.Keyboard.DOWN,
                left: Phaser.Keyboard.LEFT,
                right: Phaser.Keyboard.RIGHT,
                att: Phaser.Keyboard.SPACEBAR
            }
        };
        var playerName = !Hackatron.playerName ? this.playerId.substring(0, 2) : Hackatron.playerName;
        this.player.init(playerParams);
        this.player.setName(this, playerName);
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
        }.bind(this), 1000);
    },

    runPowerUpSystem: function() {
        setInterval(function() {
            var randomPlugin = this.powerupPlugins[this.game.rnd.integerInRange(0, this.powerupPlugins.length-1)];
            var powerup = new Powerup();
            var state = powerup.init({handler: Powerup.plugins[randomPlugin], game: this.game, map: this.mapData, player: this.player});

            this.powerups.push(powerup);

            this.addEvent({key: 'powerupSpawned', info: {plugin: randomPlugin, state: state}});
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
    addEvent: function(event) {
        this.events.push(event);
    },
    broadcastEvents: function() {
        if (!this.events.length) { return; }

        console.log('Broadcasting events...', JSON.stringify({events: this.events}));

        this.socket.emit('events', JSON.stringify({events: this.events}));
        this.events = [];
    },
    update: function() {
        var self = this;
        if (!self.player || !self.enemy) return;

        var collisionHandler = function() {
            // Scope: this = Phaser.Game
            if (self.player.invincible) { return; }

            self.player.kill();

            //self.game.fx.play('monsterRoar');
            
            self.createExplodingParticles(self.player.sprite, function() {
                self.addEvent({key: 'tronKilled', info: {
                    killedTronId: self.playerId
                }});

                self.enemy.updatePoints(self.player.points);
                self.player.sprite.emitter.destroy();
                self.player.nameText.destroy();
                self.player.sprite.destroy();
            });
            self.ai.stopPathFinding();
        };

        var block = self.player.triggerAttack(self.blockList);

        if (block !== null) {
            this.addEvent({key: 'blockSpawned', info: {
                x: block.x,
                y: block.y
            }})

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
    parseEvent: function(event) {
        var self = this;
        console.log('Receiving.. ' + event.key + ' ' + JSON.stringify(event.info));

        // Method for updating board local client game state using info
        // broadcasted to all players. The info variable contains the
        // following keys:
        // {playerId, playersPos: {posX, posY, direction}, enemyPos: {posX, posY}}
        if (event.key === 'updatePlayer') {
            var player;
            var playerId = event.info.playerId;
            var playerPos = event.info.playerPos;

            // Don't update ourself (bug?)
            if (event.info.playerId === self.playerId) { return; }

            if (!self.playerList[event.info.playerId]) {
                player = new Tron();
                var playerParams = {
                    game: self.game,
                    characterKey: 'tron',
                    emitterKey: 'blueball',
                    speed: PLAYER_SPEED,
                    x: playerPos.posX,
                    y: playerPos.posY
                };
                var playerName = !clientInfo.playerName ? playerId.substring(0, 2) : clientInfo.playerName;
                player.init(playerParams);
                player.setName(self, playerName);
                self.playerList[event.info.playerId] = {'player': player};
            } else {
                player = self.playerList[event.info.playerId].player;
            }

            // self.game.physics.arcade.collide(player.sprite, self.layer);
            // self.game.physics.arcade.collide(player.sprite, self.player.sprite, null, null, self.game);

            if (player.sprite.body) {
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

            player.sprite.x = playerPos.posX;
            player.sprite.y = playerPos.posY;
        } else if (event.key === 'updateEnemy') {
            self.enemy.sprite.x = event.info.enemyPos.posX;
            self.enemy.sprite.y = event.info.enemyPos.posY;
        // When new player joins, host shall send them data about the 'enemyPos'
        } else if (event.key === 'newPlayer') {
            if (self.playerId === self.hostId) {
                var gameData = {
                    playerId: event.info.playerId,
                    hostId: self.hostId,
                    enemy: {
                        posX: self.enemy.sprite.x,
                        posY: self.enemy.sprite.y
                    }
                };

                self.addEvent({key: 'welcomePlayer', info: gameData});
            }
        // Set up game state as a new player receiving game data from host
        } else if (event.key === 'welcomePlayer') {
            if (self.playerId === event.info.playerId) {
                self.hostId = event.info.hostId;

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
                    x: event.info.enemy.posX,
                    y: event.info.enemy.posY
                };
                enemy.init(enemyParams);
                self.enemy = enemy;
            }
        // Method for handling received deaths of other clients
        } else if (event.key === 'tronKilled') {
            // TODO: fix this
            // var player = self.playerList[event.killedTronId].player;
            // if(self.enemy && player) {
            //     self.enemy.killTron(player);
            // }
        // Method for handling spawned power ups by the host
        } else if (event.key === 'powerupSpawned') {
            // TODO: we already do this above, refactor it out
            var powerup = new Powerup();
            powerup.init({handler: Powerup.plugins[event.info.plugin], game: self.game, map: self.mapData, player: self.player, state: event.info.state});

            self.powerups.push(powerup);
        // Method for handling spawned blocks by other players
        } else if (event.key === 'blockSpawned') {
            var block = self.game.add.sprite(event.info.x, event.info.y, self.game.add.bitmapData(16, 16));
            block.key.copyRect('powerups', getRect(5, 4), 0, 0);
            self.game.physics.arcade.enable(block, Phaser.Physics.ARCADE);
            block.scale.x = 0.8;
            block.scale.y = 0.8;
            block.body.immovable = true;

            // Make block fade in 2.0 seconds
            self.game.add.tween(block).to({ alpha: 0 }, 2000, 'Linear', true, 0, -1);

            self.blockList.push(block);
            setTimeout(function() {
                self.blockList = self.blockList.filter(function(b) {
                    return (b !== block);
                });

                block.destroy();
            }, 2000);
        } else if (event.key === 'setHost') {
            self.hostId = event.info.playerId;

            // If this player is the new host, lets set them up
            if (self.hostId === self.playerId) {
                self.runEnemySystem();
                self.runAiSystem();
                self.runPowerUpSystem();
            }
        }
    },
    registerToEvents: function () {
        var self = this;

        // Method for receiving multiple events at once
        // {events: [{key: 'eventName', info: {...data here...}]}
        self.socket.on('events', function(data) {
            JSON.parse(data).events.forEach(function(event) { self.parseEvent(event); });
        });

        // Route all the events to the event parser
        ['updatePlayer',
         'updateEnemy',
         'newPlayer',
         'welcomePlayer',
         'tronKilled',
         'powerupSpawned',
         'blockSpawned',
         'setHost'].forEach(function(key) {
            self.socket.on(key, function(info) { self.parseEvent({key: key, info: info}); });
        });
    },

    // Method to broadcast to  other clients (if there are any) that you have
    // joined the game
    joinGame: function () {
        this.addEvent({key: 'newPlayer', info: {
            playerId: this.playerId,
            message: this.playerId + ' has joined the game!'
        }});
    }
};
