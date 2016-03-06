Hackatron = {
    score: 0
};

Hackatron.Game = function(game) {
    this.enemy;
    this.hostId;
    this.player;
    this.playerId;
    this.playerList;
};

var PLAYER_SPEED = 200;
var pellet;

var tilemapData;
var enemyDirection;
var posX = 0;
var posY = 0;
var moves = [];
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
        this.loadAssets();
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
        
        // Collision
        this.game.physics.arcade.enable(this.layer);
        this.map.setCollision(18);
        this.map.setCollision(52);
        this.map.setCollision(53);
        this.map.setCollision(54);
        this.map.setCollision(88);
        this.map.setCollision(89);
        
        // Create player
        var player = new Tron();
        player.init(this, 20, 20, 'tron');
        player.setName(this, this.playerId.substring(0,2));
        this.setUpSprite({
            sprite: player.sprite,
            emitterKey: 'blueball',
            upKey: Keyboard.UP,
            downKey: Keyboard.DOWN,
            leftKey: Keyboard.LEFT,
            rightKey: Keyboard.RIGHT
        });
        this.player = player;
        
        // Register to listen to events and inform
        // other players that you have joined the game
        this.registerToEvents();
        this.joinGame();
        
        // Create enemy for the host
        if (!this.enemy) {
            var spawnPosY = 20;
            var spawnPosX = 512 - 40;
            
            var enemy = new Ghost();
            enemy.init(this, spawnPosX, spawnPosY, 'ghost');
            this.setUpSprite({
                sprite: enemy.sprite,
                emitterKey: 'poop',
                upKey: Keyboard.W,
                downKey: Keyboard.S,
                leftKey: Keyboard.A,
                rightKey: Keyboard.D
            });
            this.enemy = enemy;
        }

        // Add score text
        this.scoreText = this.add.text(this.world.width - 128, 0, 'Score: 0');
        this.scoreText.addColor('White', 0);

        this.currentPlayerXtile = 0;
        this.currentPlayerYtile = 0;
        this.currentGhostXtile = 0;
        this.currentGhostYtile = 0;
        var mazeWidth = 32;
        var mazeHeight = 32;

        var convertedLevel = [];
        var originalLevel = jsonfile.layers[0].data;

        for (var i = 0, l = Math.floor(originalLevel.length / 32); i < l; ++i) {
            var row = originalLevel.slice(i * 32, i * 32 + 32);

            convertedLevel.push(row);
        }

          

        this.easystar = new EasyStar.js();
        this.easystar.setGrid(convertedLevel);
        this.easystar.setAcceptableTiles([0]);
        // easystar.enableDiagonals();
        //easystar.disableCornerCutting();
        // easystar.enableCornerCutting();

        // if (this.playerId === this.hostId) {
        //     var timeStep = 400;
        //
        //     setInterval(function() { 
        //            if (!currentPath) {
        //                 this.easystar.findPath(this.currentGhostXtile, this.currentGhostYtile, this.currentPlayerXtile, this.currentPlayerYtile, function( path ) {
        //
        //                     if (!path || path.length < 2) {
        //                         console.log("The path to the destination point was not found.");
        //                         return;
        //                     }
        //
        //                     currentPath = path;  
        //
        //                     // Periodically reset
        //                     setTimeout(function() {
        //                         currentPathIndex = 0;
        //                         currentPath = null;
        //                     }, 3000);           
        //                 }.bind(this));
        //
        //            }
        //          this.easystar.calculate();
        //
        //     if (currentPath && currentPathIndex < currentPath.length) {
        //         enemy.sprite.x = Math.floor(currentPath[currentPathIndex].x) * 16;
        //         enemy.sprite.y = Math.floor(currentPath[currentPathIndex].y) * 16;
        //
        //             if (currentPathIndex < currentPath.length-1) {
        //                 ++currentPathIndex;
        //             } else {
        //                 currentPathIndex = 0;
        //                 currentPath = null;
        //             }
        //     }
        //
        //     }.bind(this), 100);
        // }
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
        
        var playerDirection = self.updateCharPos(self.player.sprite);
        var ghostDirection = self.updateCharPos(self.enemy.sprite);
        self.game.physics.arcade.collide(self.player.sprite, self.layer);
        self.game.physics.arcade.collide(self.enemy.sprite, self.layer);
        self.game.physics.arcade.overlap(self.enemy.sprite, self.player.sprite, collisionHandler, null, self.game);
 
        var clientInfo = {
            playerId: self.playerId, 
            playerPos: {
                posX: self.player.sprite.x,
                posY: self.player.sprite.y,
                direction: playerDirection
            }
        }

        if (self.playerId === self.hostId) {
            clientInfo['enemyPos'] = {
                posX: self.enemy.sprite.x,
                posY: self.enemy.sprite.y
            }
        }
        self.socket.emit('updateClientPosition', JSON.stringify(clientInfo));

        self.currentPlayerXtile = Math.floor(self.player.sprite.x / 16);
        self.currentPlayerYtile = Math.floor(self.player.sprite.y / 16); 
        self.currentGhostXtile = Math.floor(self.enemy.sprite.x / 16);
        self.currentGhostYtile = Math.floor(self.enemy.sprite.y / 16); 
    }, 

     updateCharPos: function(sprite) {
        if (!(sprite
           && sprite.body
           && sprite.upKey 
           && sprite.downKey
           && sprite.leftKey
           && sprite.rightKey)) {
            return;
        }
        sprite.body.velocity.x = 0;
        sprite.body.velocity.y = 0;
        sprite.emitter.on = true;
        
        if (sprite.upKey.isDown) {
            sprite.animations.play('walkUp', 3, false);
            sprite.body.velocity.y = -PLAYER_SPEED;
            sprite.emitter.x = sprite.x + 15;
            sprite.emitter.y = sprite.y + 35;
            return 'walkUp';
        } else if (sprite.downKey.isDown) {
            sprite.animations.play('walkDown', 3, false);
            sprite.body.velocity.y = PLAYER_SPEED;
            sprite.emitter.x = sprite.x + 15;
            sprite.emitter.y = sprite.y + -5;            
            return 'walkDown';
        } else if (sprite.leftKey.isDown) {
            sprite.animations.play('walkLeft', 3, false);
            sprite.body.velocity.x = -PLAYER_SPEED;
            sprite.emitter.x = sprite.x + 30;
            sprite.emitter.y = sprite.y + 15;            
            if (sprite.x < 0) {
                sprite.x = this.world.width;
            }
            return 'walkLeft';
        } else if (sprite.rightKey.isDown) {
            sprite.animations.play('walkRight', 3, false);
            sprite.body.velocity.x = PLAYER_SPEED;
            if (sprite.x > this.world.width) {
                sprite.x = 0;
            }
            sprite.emitter.x = sprite.x;
            sprite.emitter.y = sprite.y + 15;    
            return 'walkRight';
        } else {
            sprite.emitter.on = false;
        }

    }, 

    pelletHelper: function(mapArray){
//        var pelletArr = [];
        var x = 0;
        var y = 0;
        var pos = 1;
        for(pos = 1; pos < mapArray.length ; pos++){
            if(pos % 32 === 0){
                x = 0;
                y++;
            }
            else
                x++;
            
            if(mapArray[pos] === 0){
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
            var playerId = clientInfo.playerId;
            var playerPos = clientInfo.playerPos;
            var player; 
            if (!self.playerList[clientInfo.playerId]) {
                player = new Tron();
                player.init(self, playerPos.posX, playerPos.posY, 'tron');
                player.setName(self, clientInfo.playerId.substring(0,2));
                self.setUpSprite({sprite: player.sprite, emitterKey: 'blueball'});
                self.playerList[clientInfo.playerId] = {'player': player};
            } else {
                player = self.playerList[clientInfo.playerId].player;
            } 
            
            self.game.physics.arcade.collide(player.sprite, self.player.sprite, null, null, self.game);
            if(player.sprite.body) {
                player.sprite.body.velocity.x = 0;
                player.sprite.body.velocity.y = 0;
                player.sprite.animations.play(playerPos.direction, 3, false);
                player.sprite.emitter.on = true;
                switch(playerPos.direction) {
                    case 'walkUp':
                        player.sprite.body.velocity.y = -PLAYER_SPEED;
                        player.sprite.emitter.x = player.sprite.x + 15;
                        player.sprite.emitter.y = player.sprite.y + 35;
                        break;

                    case 'walkDown':
                        player.sprite.body.velocity.y = PLAYER_SPEED;
                        player.sprite.emitter.x = player.sprite.x + 15;
                        player.sprite.emitter.y = player.sprite.y + -5;
                        break;

                    case 'walkLeft':
                        player.sprite.body.velocity.x = -PLAYER_SPEED;
                        player.sprite.emitter.x = player.sprite.x + 30;
                        player.sprite.emitter.y = player.sprite.y + 15;            
                        break;

                    case 'walkRight':
                        player.sprite.body.velocity.x = PLAYER_SPEED;
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
            

            // player.sprite.x = playerPos.posX;
            // player.sprite.y = playerPos.posY;

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
                console.log(eventInfo.killedTronId + ' was killed!');
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
    // Method for loading all assets/resources at game-level 
    // Resources loaded from gitHub since Heroku does not compile assets
    loadAssets: function() {
        var baseURL = 'https://raw.githubusercontent.com/tony-dinh\
                      /hackatron/master/assets/';
        
        // this === Hackatron.Game
        // load all resources/assets here
        this.load.image('blueball', baseURL + 'blueball.png');
        this.load.image('pellet', baseURL + 'pellet.png');
        this.load.image('poop', baseURL + 'poop.png');
        this.load.image('tiles', baseURL + 'part2_tileset.png');
        this.load.json('JSONobj', baseURL + 'tiles1.json');
        this.load.spritesheet('ghost', baseURL + 'ghost.png', 32, 32, 12);
        this.load.spritesheet('tron', baseURL + 'tron.png', 32, 32, 12);
        this.load.tilemap('map', baseURL + 'tiles1.json', null, Phaser.Tilemap.TILED_JSON);
    },
   
    // Method for assigning animations to a sprite given that a 3x3
    // sprite sheet has been loaded.
    addAnimationsToSprite: function(sprite) {
        sprite.animations.add('walkUp', [9,10,11], 3, false, true);
        sprite.animations.add('walkDown', [0,1,2], 3, false, true);
        sprite.animations.add('walkLeft', [3,4,5], 3, false, true);
        sprite.animations.add('walkRight', [6,7,8], 3, false, true);
    },

    // Method for registering hardware keys to a given sprite
    setUpKeys: function(sprite, up, down, left, right) {
        if(!(up && down && left && right)) return;

        sprite.upKey = this.input.keyboard.addKey(up);
        sprite.downKey = this.input.keyboard.addKey(down);
        sprite.leftKey = this.input.keyboard.addKey(left);
        sprite.rightKey = this.input.keyboard.addKey(right);
    },
    
    // Method for setting up sprite by passing in params structured
    // with the following keys:
    //     {sprite, emitterKey, upKey, downKey, leftKey, rightKey}
    setUpSprite: function(params) {
        var sprite = params.sprite;
        this.game.physics.arcade.enable(sprite, Phaser.Physics.ARCADE);
        this.addAnimationsToSprite(sprite); 
        sprite.scale.x = 0.8;
        sprite.scale.y = 0.8;
        this.setUpKeys(
            sprite,
            params.upKey,
            params.downKey,
            params.leftKey,
            params.rightKey
        );
        
        var emitter = this.add.emitter(sprite.x, sprite.y, 50);
        emitter.width = 5;
        emitter.makeParticles(params.emitterKey);
        emitter.setXSpeed();
        emitter.setYSpeed();
        emitter.setRotation();
        emitter.setAlpha(1, 0.4, 800);
        emitter.setScale(0.05, 0.2, 0.05, 0.2, 2000, Phaser.Easing.Quintic.Out);
        emitter.start(false,250, 1);

        sprite.emitter = emitter;
    }
};
