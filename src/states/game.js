Hackatron = {
    score: 0
};

Hackatron.Game = function(game) {
    this.enemy = null;
    this.hostId = null;
    this.player = null;
    this.playerId = null;
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

    create: function() {
        // Client set-up
        this.playerId = generateId();
        this.hostId = this.playerId;
        this.playerList = {};
        this.socket = io.connect();
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        // Create the map
        var jsonfile = this.cache.getJSON('JSONobj');
        var data = jsonfile.layers[0].data;
        this.pelletHelper(data);
        this.map = this.add.tilemap('map');
        this.map.addTilesetImage('Wall', 'tiles');
        this.layer = this.map.createLayer('Tile Layer 1');
        this.layer.resizeWorld();
        var Keyboard = Phaser.Keyboard;

        var portal = new Portal();
        portal.init(this.game);
        this.portal = portal;
        this.game.physics.arcade.enable(this.portal);
        // Collision
        this.game.physics.arcade.enable(this.layer);
        this.map.setCollision([18, 52, 53, 54, 88, 89]);

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
                up: Keyboard.UP,
                down: Keyboard.DOWN,
                left: Keyboard.LEFT,
                right: Keyboard.RIGHT,
                att: Keyboard.SPACEBAR
            }
        };
        player.init(playerParams);
        player.setName(this, Hackatron.playerName);
        this.player = player;

        // Register to listen to events and inform
        // other players that you have joined the game
        this.registerToEvents();
        this.joinGame();

        // Create enemy for the host
        if (!this.enemy) {
            spawnPosY = 20;
            spawnPosX = 512 - 40;
            enemyParams = {
                game: this.game,
                speed:PLAYER_SPEED,
                characterKey: 'ghost',
                emitterKey: 'poop',
                x: spawnPosX,
                y: spawnPosY,
                keys: {
                    up: Keyboard.W,
                    down: Keyboard.S,
                    left: Keyboard.A,
                    right: Keyboard.D
                }
            };
            var enemy = new Ghost();
            enemy.init(enemyParams);
            this.enemy = enemy;
        }

        // Add score text
        this.scoreText = this.add.text(this.world.width - 128, 0, 'Score: 0');
        this.scoreText.addColor('White', 0);

        this.currentPlayerXtile = 0;
        this.currentPlayerYtile = 0;
        this.currentGhostXtile = 0;
        this.currentGhostYtile = 0;

        this.ai = new AI();
        this.ai.init(jsonfile);
    },

    update: function() {
        // this === Hackatron.Game
        var self = this;
        if (!self.player || !self.enemy) return;

        var collisionHandler = function() {
            // this === Phaser.Game
            self.socket.emit('tronKilled', JSON.stringify({
                killedTronId: self.playerId
            }));

            self.enemy.killTron(self.player);
            // //enemy.stopPathFinding;
            // var rebootGhost= function() {
            //     //enemy.startPathFinding;
            // };
            //
            // self.game.time.events.add(Phaser.Timer.SECOND * 2, rebootGhost, this);
        };

        var portalTransition = function() {
            console.log("I hit the portal");
        };

        var ghostDirection = self.enemy.updatePos();
        var playerDirection = self.player.updatePos();
        self.player.triggerAttack(playerDirection);

        // Check for collisions
        self.game.physics.arcade.collide(self.player.sprite, self.layer);
        self.game.physics.arcade.collide(self.enemy.sprite, self.layer);
        self.game.physics.arcade.overlap(self.player.sprite, this.portal.entryProtal, portalTransition, null, self.game);
        self.game.physics.arcade.overlap(self.player.sprite, this.portal.exitProtal, portalTransition, null, self.game);
        self.game.physics.arcade.overlap(self.enemy.sprite, self.player.sprite, collisionHandler, null, self.game);

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

        self.currentPlayerXtile = Math.floor(self.player.sprite.x / 16);
        self.currentPlayerYtile = Math.floor(self.player.sprite.y / 16);
        self.currentGhostXtile = Math.floor(self.enemy.sprite.x / 16);
        self.currentGhostYtile = Math.floor(self.enemy.sprite.y / 16);
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
                player.init(self, playerPos.posX, playerPos.posY, 'tron');
                player.setName(self, clientInfo.playerId.substring(0,2));
                self.setUpSprite({sprite: player.sprite, emitterKey: 'blueball'});
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
                enemy.init(self, gameData.enemy.posX, gameData.enemy.posY, 'ghost');
                self.setUpSprite({
                    sprite: enemy.sprite,
                    emitterKey: 'poop'
                });
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
    },

    // Method to broadcast to  other clients (if there are any) that you have
    // joined the game
    joinGame: function () {
        this.socket.emit('newPlayer', JSON.stringify({
            playerId: this.playerId,
            message: this.playerId + ' has joined the game!'
        }));
    },

// ============================================================================
//                              Helper Methods
// ============================================================================
};
