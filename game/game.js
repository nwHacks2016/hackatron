Hackatron = {
    score: 0
};

Hackatron.Game = function(game) {
    this.player;
};

var tron1;
var ghost1;
var pellet;

var upKey;
var downKey;
var leftKey;
var rightKey;
var emitter1;
var emitter2;
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
        this.load.tilemap('map', 'https://raw.githubusercontent.com/nwHacks2016/hackatron/master/assets/tiles1.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles', 'https://raw.githubusercontent.com/nwHacks2016/hackatron/master/assets/part2_tileset.png');
        this.load.spritesheet('tron', 'https://raw.githubusercontent.com/nwHacks2016/hackatron/master/Images/tron.png', 32, 32, 12);
        this.load.spritesheet('ghost', 'https://raw.githubusercontent.com/nwHacks2016/hackatron/master/Images/ghost.png', 32, 32, 12);

        this.load.json('JSONobj', 'https://raw.githubusercontent.com/nwHacks2016/hackatron/master/assets/tiles1.json');
        this.load.image('pellet', 'https://raw.githubusercontent.com/nwHacks2016/hackatron/master/assets/pellet.png');
        
        this.load.image('blueball', 'images/blueball.png');
        this.load.image('poop', 'https://raw.githubusercontent.com/nwHacks2016/hackatron/master/Images/poop.png');
    },

    create: function() {
        this.playerId = guid();
        this.playerList = [];
        this.socket = io.connect();
        this.updateClientSideListener();
        this.sendMessageToBankend();    // tell everyone you started a game



        var jsonfile = this.cache.getJSON('JSONobj');
        var data = jsonfile.layers[0].data;
        this.pelletHelper(data);

        // Create the map
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.map = this.add.tilemap('map');
        this.map.addTilesetImage('Wall', 'tiles');

        this.layer = this.map.createLayer('Tile Layer 1');
        this.layer.resizeWorld();

        var addAnimations = function(character) {
            character.animations.add('walkUp', [9,10,11], 3, false, true);
            character.animations.add('walkDown', [0,1,2], 3, false, true);
            character.animations.add('walkLeft', [3,4,5], 3, false, true);
            character.animations.add('walkRight', [6,7,8], 3, false, true);
        };

        var setKeys = function(character, game, up, down, left, right) {
            character.upKey = game.input.keyboard.addKey(up);
            character.downKey = game.input.keyboard.addKey(down);
            character.leftKey = game.input.keyboard.addKey(left);
            character.rightKey = game.input.keyboard.addKey(right);
        };

        var Keyboard = Phaser.Keyboard;

        tron1 = new Tron();
        tron1.init(this.game, 20, 20, 'tron');
        tron1.setName(this.game, this.playerId.substring(0,2));
        addAnimations(tron1.character);
        setKeys(tron1.character, this, Keyboard.UP, Keyboard.DOWN, Keyboard.LEFT, Keyboard.RIGHT);

        if (!ghost1) {
            ghost1 = new Ghost();
            ghost1.init(this.game, 50, 20, 'ghost');
            addAnimations(ghost1.character);
            setKeys(ghost1.character, this, Keyboard.W, Keyboard.S, Keyboard.A, Keyboard.D);
            ghost1.character.scale.x = 0.8;
            ghost1.character.scale.y = 0.8;
            this.game.physics.arcade.enable([tron1.character, ghost1.character], Phaser.Physics.ARCADE);

    		emitter2 = this.add.emitter(ghost1.character.x, ghost1.character.y, 50);
    		emitter2.width = 5;
    		emitter2.makeParticles('poop');
    		emitter2.setXSpeed();
    		emitter2.setYSpeed();
    		emitter2.setRotation();
    		emitter2.setAlpha(1, 0.4, 800);
    		emitter2.setScale(0.05, 0.2, 0.05, 0.2, 2000, Phaser.Easing.Quintic.Out);
    		emitter2.start(false,250, 1);
            ghost1.character.emitter = emitter2;
        }

        tron1.character.scale.x = 0.8;
        tron1.character.scale.y = 0.8;

        // Collision
        this.game.physics.arcade.enable(this.layer);
        this.map.setCollision(18);
        this.map.setCollision(88);
        this.map.setCollision(54);
        this.map.setCollision(89);
        this.map.setCollision(53);
        this.map.setCollision(52);


        emitter1 = this.add.emitter(tron1.character.x, tron1.character.y, 50);
        emitter1.width = 5;
        emitter1.makeParticles('blueball');
        emitter1.setXSpeed();
        emitter1.setYSpeed();
        emitter1.setRotation();
        emitter1.setAlpha(1, 0.4, 800);
        emitter1.setScale(0.05, 0.2, 0.05, 0.2, 2000, Phaser.Easing.Quintic.Out);
        emitter1.start(false,250, 1);
        
        emitter2 = this.add.emitter(ghost1.character.x, ghost1.character.y, 50);
        emitter2.width = 5;
        emitter2.makeParticles('poop');
        emitter2.setXSpeed();
        emitter2.setYSpeed();
        emitter2.setRotation();
        emitter2.setAlpha(1, 0.4, 800);
        emitter2.setScale(0.05, 0.2, 0.05, 0.2, 2000, Phaser.Easing.Quintic.Out);
        emitter2.start(false,250, 1);

        tron1.character.emitter = emitter1;

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
                            
          // var posX = this.currentPlayerXtile;
          // var posY = this.currentPlayerYtile;
               
               // var possibleDirections = "";
               // if(posX+2 > 0 && posX + 2 < this.currentGhostXtile){
               //      possibleDirections += "S";
               // }
               // if(posX-2 > 0 && posX - 2 < this.currentGhostXtile){
               //      possibleDirections += "N";
               // }
               // if(posY-2 > 0 && posY - 2 < this.currentGhostYtile){
               //      possibleDirections += "W";
               // }
               // if(posY+2 > 0 && posY + 2 < this.currentGhostYtile){
               //      possibleDirections += "E";
               // }
               // if(possibleDirections){
               //      var move = this.game.rnd.between(0, possibleDirections.length - 1);
               //      switch (possibleDirections[move]){
               //           case "N": 
               //                posX -= 2;
               //                break;
               //           case "S":
               //                posX += 2;
               //                break;
               //                posY -= 2;
               //                break;
               //           case "E":
               //                posY += 2;
               //                break;         
               //      }
               //      moves.push({x: posX, y: posY});     
               // }
               // else if (moves.length) {
               //      var back = moves.pop();
               //      posX = Math.floor(back.x / mazeWidth);
               //      posY = back.y % mazeHeight;
               // }  

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
            // currentNextPointX = currentPath[currentPathIndex].x;
            // currentNextPointY = currentPath[currentPathIndex].y;
                
           //  if (currentNextPointX == this.currentGhostXtile && currentNextPointY < this.currentGhostYtile)
           //  {
           //     // up
                                
           //     console.log("GO UP");
                                
           //     enemyDirection = "N";
                                
           //  }
           // else if (currentNextPointX < this.currentGhostXtile && currentNextPointY == this.currentGhostYtile)
           // {
           //    // left
                                
           //     console.log("GO LEFT");
                                
           //     enemyDirection = "W";
                                
           // }
           // else if (currentNextPointX > this.currentGhostXtile && currentNextPointY == this.currentGhostYtile)
           // {
           //    // right
                                
           //     console.log("GO RIGHT");
                                
           //     enemyDirection = "E";
                            
           // }    
           // else if (currentNextPointX == this.currentGhostXtile && currentNextPointY > this.currentGhostYtile)
           // {
           //    // down
                                
           //   console.log("GO DOWN");
                                
           //   enemyDirection = "S";
                                
           // }            
           // //  else if (currentNextPointX < this.currentGhostXtile && currentNextPointY < this.currentGhostYtile) {
           // //     // left up
                                
           // //     console.log("GO LEFT UP");
                                
           // //     enemyDirection = "NW";
           // //  }
           // //  else if (currentNextPointX > this.currentGhostXtile && currentNextPointY < this.currentGhostYtile)
           // //  {
           // //     // right up
                                
           // //     console.log("GO RIGHT UP");
                                
           // //     enemyDirection = "NE";
                                
           // // }
           // // else if (currentNextPointX > this.currentGhostXtile && currentNextPointY > this.currentGhostYtile)
           // // {
           // //    // right down
                                
           // //  console.log("GO RIGHT DOWN");
                                
           // //  enemyDirection = "SE";
                                
           // // }
           // // else if (currentNextPointX < this.currentGhostXtile && currentNextPointY > this.currentGhostYtile)
           // // {
           // //   // left down
                                
           // //  console.log("GO LEFT DOWN");
                                
           // //  enemyDirection = "SW";
                                
           // // }
           // else
           // {
                                
           //  enemyDirection = null;//"STOP";
                                
           // }
                            
           // if (enemyDirection != "STOP") ghost1.character.animations.play(enemyDirection); 
            // this.currentGhostXtile = posX;
            // this.currentGhostYtile = posY; 
            // var enemySpeed = 900;

            // if (enemyDirection) {
            //     ghost1.character.body.velocity.x = 0;
            //     ghost1.character.body.velocity.y = 0;
               
            //     if (enemyDirection.indexOf('N') !== -1) {
            //         ghost1.character.body.velocity.y = -enemySpeed;
            //     }
            //     if (enemyDirection.indexOf('S') !== -1) {
            //         ghost1.character.body.velocity.y = enemySpeed;
            //     }
            //     if (enemyDirection.indexOf('E') !== -1) {
            //         ghost1.character.body.velocity.x = enemySpeed;
            //     }
            //     if (enemyDirection.indexOf('W') !== -1) {
            //         ghost1.character.body.velocity.x = -enemySpeed;
            //     }
            // }

            ghost1.character.x = Math.floor(currentPath[currentPathIndex].x) * 16;
            ghost1.character.y = Math.floor(currentPath[currentPathIndex].y) * 16;

            //if (currentNextPointX == this.currentGhostXtile && currentNextPointY == this.currentGhostYtile) {
                if (currentPathIndex < currentPath.length-1) {
                    ++currentPathIndex;
                } else {
                    currentPathIndex = 0;
                    currentPath = null;
                }
            //}
        }

        }.bind(this), 100);
    }, 

    update: function() {
        var collisionHandler = function() {
            ghost1.killTron(tron1);
            //ghost1.stopPathFinding;
            var rebootGhost= function() {
                //ghost1.startPathFinding;
            };

            this.time.events.add(Phaser.Timer.SECOND * 2, rebootGhost, this);
        };

        this.updateCharPos(tron1.character, 200);
        this.updateCharPos(ghost1.character, 200);
        this.game.physics.arcade.collide(tron1.character, this.layer);
        this.game.physics.arcade.collide(ghost1.character, this.layer);
        this.game.physics.arcade.collide(ghost1.character, tron1.character, collisionHandler, null, this.game);
    
        this.socket.emit('playerMove', JSON.stringify({
            playerId: this.playerId, 
            tron_x: tron1.character.x, 
            tron_y: tron1.character.y,
            ghost_x: ghost1.character.x,
            ghost_y: ghost1.character.y
        }));

        this.currentPlayerXtile = Math.floor(tron1.character.x / 16);
        this.currentPlayerYtile = Math.floor(tron1.character.y / 16); 
        this.currentGhostXtile = Math.floor(ghost1.character.x / 16);
        this.currentGhostYtile = Math.floor(ghost1.character.y / 16); 

    }, 

     updateCharPos: function(character, speed) {
        if(!character || !character.body) return;
        character.body.velocity.x = 0;
        character.body.velocity.y = 0;
        if (character.upKey.isDown) {
            character.animations.play('walkUp', 3, false);
            character.body.velocity.y = -speed;
            character.emitter.x = character.x + 15;
            character.emitter.y = character.y + 35;
        } else if (character.downKey.isDown) {
            character.animations.play('walkDown', 3, false);
            character.body.velocity.y = speed;
            character.emitter.x = character.x + 15;
            character.emitter.y = character.y + -5;            
        } else if (character.leftKey.isDown) {
            character.animations.play('walkLeft', 3, false);
            character.body.velocity.x = -speed;
            character.emitter.x = character.x + 30;
            character.emitter.y = character.y + 15;            
            if (character.x < 0) {
                character.x = this.world.width;
            }
        } else if (character.rightKey.isDown) {
            character.animations.play('walkRight', 3, false);
            character.body.velocity.x = speed;
            if (character.x > this.world.width) {
                character.x = 0;
            }
            character.emitter.x = character.x;
            character.emitter.y = character.y + 15;    
        }

        return {x: character.x, y: character.y};
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
            // console.log(data);
            // if (!this.playerList) {
            //     this.playerList = [];
            // }

            if (!this.playerList[data.playerId]) {
                this.playerList[data.playerId] = data;
                var tron = new Tron();
                tron.init(this.game, 20, 20, 'tron');
                this.playerList[data.playerId].tron = tron;
                tron.setName(this.game, data.playerId.substring(0,2));
                this.physics.enable(this.playerList[data.playerId].tron, Phaser.Physics.ARCADE);
                this.playerList[data.playerId].tron.character.scale.x = 0.8;
                this.playerList[data.playerId].tron.character.scale.y = 0.8;
            }

            var player = this.playerList[data.playerId];

            player.tron.character.x = data.tron_x;
            player.tron.character.y = data.tron_y;
            // ghost1.character.x = data.ghost_x;
            // ghost1.character.y = data.ghost_y;
            // emitter2.x = data.ghost_x;
            // emitter2.y = data.ghost_y;
        }.bind(this));

        this.socket.on('gameStarted', function(data) {
            data = JSON.parse(data);
            console.log(data);
            this.playerList[data.playerId] = data;
            var tron = new Tron();
            tron.init(this, 20, 20, 'tron');
            tron.setName(this.game, data.playerId.substring(0,2));
            this.playerList[data.playerId].tron = tron;
            this.physics.enable(this.playerList[data.playerId].tron, Phaser.Physics.ARCADE);
            this.playerList[data.playerId].tron.character.scale.x = 0.8;
            this.playerList[data.playerId].tron.character.scale.y = 0.8;

        }.bind(this));
    },
    sendMessageToBankend : function () {
        this.socket.emit('gameStarted', JSON.stringify({
            playerId: this.playerId,
            sMessage: this.playerId + "just started a new game"
        }));
    }
};
