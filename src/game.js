Hackatron = {
    score: 0
};

Hackatron.Game = function(game) {
    this.player;
};

var myPlayer;
var enemy;
var pellet;

var tilemapData;
var enemyDirection;
var posX = 0;
var posY = 0;
        var moves = [];
        var currentPath;
        var currentPathIndex = 0;

function guid() {
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
        this.playerId = guid();
        this.playerList = [];
        this.socket = io.connect();



        var jsonfile = this.cache.getJSON('JSONobj');
        var data = jsonfile.layers[0].data;
        this.pelletHelper(data);

        // Create the map
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.map = this.add.tilemap('map');
        this.map.addTilesetImage('Wall', 'tiles');

        this.layer = this.map.createLayer('Tile Layer 1');
        this.layer.resizeWorld();
        
        var addAnimations = function(sprite) {
            sprite.animations.add('walkUp', [9,10,11], 3, false, true);
            sprite.animations.add('walkDown', [0,1,2], 3, false, true);
            sprite.animations.add('walkLeft', [3,4,5], 3, false, true);
            sprite.animations.add('walkRight', [6,7,8], 3, false, true);
        };

        var setKeys = function(sprite, game, up, down, left, right) {
            sprite.upKey = game.input.keyboard.addKey(up);
            sprite.downKey = game.input.keyboard.addKey(down);
            sprite.leftKey = game.input.keyboard.addKey(left);
            sprite.rightKey = game.input.keyboard.addKey(right);
        };

        var Keyboard = Phaser.Keyboard;
       
        if(!myPlayer){
            myPlayer = new Tron();
            myPlayer.init(this, 20, 20, 'tron');
            myPlayer.setName(this, this.playerId.substring(0,2));
            addAnimations(myPlayer.sprite);
            setKeys(myPlayer.sprite, this, Keyboard.UP, Keyboard.DOWN, Keyboard.LEFT, Keyboard.RIGHT);

            myPlayer.sprite.scale.x = 0.8;
            myPlayer.sprite.scale.y = 0.8;

            var emitter = this.add.emitter(myPlayer.sprite.x, myPlayer.sprite.y, 50);
            emitter.width = 5;
            emitter.makeParticles('blueball');
            emitter.setXSpeed();
            emitter.setYSpeed();
            emitter.setRotation();
            emitter.setAlpha(1, 0.4, 800);
            emitter.setScale(0.05, 0.2, 0.05, 0.2, 2000, Phaser.Easing.Quintic.Out);
            emitter.start(false,250, 1);
            
            myPlayer.sprite.emitter = emitter;
            
            myPlayer.setName(this, this.playerId.substring(0,2));
            this.physics.enable(myPlayer, Phaser.Physics.ARCADE);

        }

        this.updateClientSideListener();
        this.sendMessageToBankend();    // tell everyone you started a game

        if (!enemy) {
            enemy = new Ghost();
            enemy.init(this, 512-20, 20, 'ghost');
            addAnimations(enemy.sprite);
            enemy.sprite.scale.x = 0.8;
            enemy.sprite.scale.y = 0.8;
            this.game.physics.arcade.enable([myPlayer.sprite, enemy.sprite], Phaser.Physics.ARCADE);
            setKeys(enemy.sprite, this, Keyboard.W, Keyboard.S, Keyboard.A, Keyboard.D);

            var emitter = this.add.emitter(enemy.sprite.x, enemy.sprite.y, 50);
            emitter.width = 5;
            emitter.makeParticles('poop');
            emitter.setXSpeed();
            emitter.setYSpeed();
            emitter.setRotation();
            emitter.setAlpha(1, 0.4, 800);
            emitter.setScale(0.05, 0.2, 0.05, 0.2, 2000, Phaser.Easing.Quintic.Out);
            emitter.start(false,250, 1);
            enemy.sprite.emitter = emitter;
            this.playerList.ghost = enemy;
        }


        // Collision
        this.game.physics.arcade.enable(this.layer);
        this.map.setCollision(18);
        this.map.setCollision(88);
        this.map.setCollision(54);
        this.map.setCollision(89);
        this.map.setCollision(53);
        this.map.setCollision(52);



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

        var timeStep = 400;

        setInterval(function() { 

               if (!currentPath) {
                    this.easystar.findPath(this.currentGhostXtile, this.currentGhostYtile, this.currentPlayerXtile, this.currentPlayerYtile, function( path ) {

                        if (!path || path.length < 2) {
                            console.log("The path to the destination point was not found.");
                            return;
                        }

                        currentPath = path;  

                        // Periodically reset
                        setTimeout(function() {
                            currentPathIndex = 0;
                            currentPath = null;
                        }, 3000);           
                    }.bind(this));

               }
             this.easystar.calculate();


        if (currentPath && currentPathIndex < currentPath.length) {
            enemy.sprite.x = Math.floor(currentPath[currentPathIndex].x) * 16;
            enemy.sprite.y = Math.floor(currentPath[currentPathIndex].y) * 16;

                if (currentPathIndex < currentPath.length-1) {
                    ++currentPathIndex;
                } else {
                    currentPathIndex = 0;
                    currentPath = null;
                }
        }

        }.bind(this), 100);
    }, 

    update: function() {
        var self = this;
        if (!myPlayer || !enemy) return;
        var collisionHandler = function() {
            self.socket.emit('tronKilled', JSON.stringify({
                killedTronId: self.playerId
            }));

            enemy.killTron(myPlayer);
            //enemy.stopPathFinding;
            var rebootGhost= function() {
                //enemy.startPathFinding;
            };

            self.game.time.events.add(Phaser.Timer.SECOND * 2, rebootGhost, this);
        };

        var playerDirection = this.updateCharPos(myPlayer.sprite, 200);
        var ghostDirection = this.updateCharPos(enemy.sprite, 200);
        this.game.physics.arcade.collide(myPlayer.sprite, this.layer);
        this.game.physics.arcade.collide(enemy.sprite, this.layer);
        this.game.physics.arcade.overlap(enemy.sprite, myPlayer.sprite, collisionHandler, null, this.game);
    
        this.socket.emit('playerMove', JSON.stringify({
            playerId: this.playerId, 
            tron_x: myPlayer.sprite.x, 
            tron_y: myPlayer.sprite.y,
            playerDirection: playerDirection,
            ghost_x: enemy.sprite.x,
            ghost_y: enemy.sprite.y,
            ghostDirection: ghostDirection
        }));

        this.currentPlayerXtile = Math.floor(myPlayer.sprite.x / 16);
        this.currentPlayerYtile = Math.floor(myPlayer.sprite.y / 16); 
        this.currentGhostXtile = Math.floor(enemy.sprite.x / 16);
        this.currentGhostYtile = Math.floor(enemy.sprite.y / 16); 

    }, 

     updateCharPos: function(sprite, speed) {
        if(!sprite || !sprite.body) return;
        sprite.body.velocity.x = 0;
        sprite.body.velocity.y = 0;
        if (sprite.upKey.isDown) {
            sprite.animations.play('walkUp', 3, false);
            sprite.body.velocity.y = -speed;
            sprite.emitter.x = sprite.x + 15;
            sprite.emitter.y = sprite.y + 35;
            return 'walkUp';
        } else if (sprite.downKey.isDown) {
            sprite.animations.play('walkDown', 3, false);
            sprite.body.velocity.y = speed;
            sprite.emitter.x = sprite.x + 15;
            sprite.emitter.y = sprite.y + -5;            
            return 'walkDown';
        } else if (sprite.leftKey.isDown) {
            sprite.animations.play('walkLeft', 3, false);
            sprite.body.velocity.x = -speed;
            sprite.emitter.x = sprite.x + 30;
            sprite.emitter.y = sprite.y + 15;            
            if (sprite.x < 0) {
                sprite.x = this.world.width;
            }
            return 'walkLeft';
        } else if (sprite.rightKey.isDown) {
            sprite.animations.play('walkRight', 3, false);
            sprite.body.velocity.x = speed;
            if (sprite.x > this.world.width) {
                sprite.x = 0;
            }
            sprite.emitter.x = sprite.x;
            sprite.emitter.y = sprite.y + 15;    
            return 'walkRight';
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

    updateClientSideListener : function () {
        this.socket.on('playerMove', function(data) {
            data = JSON.parse(data);

            var addAnimations = function(sprite) {
                sprite.animations.add('walkUp', [9,10,11], 3, false, true);
                sprite.animations.add('walkDown', [0,1,2], 3, false, true);
                sprite.animations.add('walkLeft', [3,4,5], 3, false, true);
                sprite.animations.add('walkRight', [6,7,8], 3, false, true);
            };

            if (!this.playerList[data.playerId]) {
                this.playerList[data.playerId] = {};
                var tron = new Tron();
                tron.init(this.game, data.tron_x, data.tron_y, 'tron');
                addAnimations(tron.sprite);
                tron.sprite.scale.x = 0.8;
                tron.sprite.scale.y = 0.8;
                tron.setName(this.game, data.playerId.substring(0,2));
                this.physics.enable(tron, Phaser.Physics.ARCADE);
                this.physics.arcade.enable([myPlayer.sprite, tron.sprite], Phaser.Physics.ARCADE);
                this.playerList[data.playerId].tron = tron;
                tron.sprite.animations.play(data.spriteDirection, 3, false);
            } else {
                var player = this.playerList[data.playerId].tron;
                player.sprite.x = data.tron_x;
                player.sprite.y = data.tron_y;
                player.sprite.animations.play(data.spriteDirection, 3, false);
                
            }
            if (!this.playerList.ghost) {
                enemy = new Ghost();
                enemy.init(this.game, data.ghost_x, data.ghost_y, 'ghost');
                addAnimations(enemy.sprite);
                enemy.sprite.scale.x = 0.8;
                enemy.sprite.scale.y = 0.8;
                this.game.physics.arcade.enable([myPlayer.sprite, enemy.sprite], Phaser.Physics.ARCADE);
                this.playerList.ghost = enemy;
            } else {
                enemy.sprite.x = data.ghost_x;
                enemy.sprite.y = data.ghost_y;
            }
            // emitter.x = data.ghost_x;
            // emitter.y = data.ghost_y;
        }.bind(this));

        this.socket.on('newPlayer', function(data) {
            data = JSON.parse(data);
            console.log(data);
            var addAnimations = function(sprite) {
                sprite.animations.add('walkUp', [9,10,11], 3, false, true);
                sprite.animations.add('walkDown', [0,1,2], 3, false, true);
                sprite.animations.add('walkLeft', [3,4,5], 3, false, true);
                sprite.animations.add('walkRight', [6,7,8], 3, false, true);
            };

            if(!this.playerList[data.playerId]){
                var tron = new Tron();
                tron.init(this, 20, 20, 'tron');
                tron.setName(this, this.playerId.substring(0,2));
                addAnimations(tron.sprite);
                setKeys(tron.sprite, this, Keyboard.UP, Keyboard.DOWN, Keyboard.LEFT, Keyboard.RIGHT);

                tron.sprite.scale.x = 0.8;
                tron.sprite.scale.y = 0.8;

                var emitter = this.add.emitter(tron.sprite.x, tron.sprite.y, 50);
                emitter.width = 5;
                emitter.makeParticles('blueball');
                emitter.setXSpeed();
                emitter.setYSpeed();
                emitter.setRotation();
                emitter.setAlpha(1, 0.4, 800);
                emitter.setScale(0.05, 0.2, 0.05, 0.2, 2000, Phaser.Easing.Quintic.Out);
                emitter.start(false,250, 1);
                
                tron.character.emitter = emitter;
                
                this.playerList[data.playerId] = data;
                tron.setName(this, data.playerId.substring(0,2));
                tron.playerList[data.playerId].tron = tron;
                tron.physics.enable(tron, Phaser.Physics.ARCADE);
            }

        }.bind(this));

        this.socket.on('tronKilled', function(data) {
            console.log(this.playerList[data.killedTronId] + 'was killed!');
            data = JSON.parse(data);
            var tron = this.playerList[data.killedTronId].tron;
            if(tron) {
                enemy.killTron(tron);
            }
        }.bind(this));
    },
    sendMessageToBankend : function () {
        this.socket.emit('newPlayer', JSON.stringify({
            playerId: this.playerId,
            sMessage: this.playerId + " just joined the game"
        }));
    },

    loadAssets: function() {
        // Resources loaded from gitHub since Heroku does not compile assets
        var baseURL = 'https://raw.githubusercontent.com/tony-dinh/hackatron/master/';
        
        // this === Hackatron.Game
        this.load.image('blueball', baseURL + 'assets/blueball.png');
        this.load.image('pellet', baseURL + 'assets/pellet.png');
        this.load.image('poop', baseURL + 'assets/poop.png');
        this.load.image('tiles', baseURL + 'assets/part2_tileset.png');
        this.load.json('JSONobj', baseURL + 'assets/tiles1.json');
        this.load.spritesheet('ghost', baseURL + 'assets/ghost.png', 32, 32, 12);
        this.load.spritesheet('tron', baseURL + 'assets/tron.png', 32, 32, 12);
        this.load.tilemap('map', baseURL + 'assets/tiles1.json', null, Phaser.Tilemap.TILED_JSON);
    }
};
