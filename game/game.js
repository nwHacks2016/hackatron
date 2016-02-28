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
var tilemapData;

Hackatron.Game.prototype = {
    preload: function() {
        this.load.tilemap('map', 'assets/tiles1.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles', 'assets/part2_tileset.png');
        this.load.spritesheet('tron', 'images/tron.png', 32, 32, 12);
        this.load.spritesheet('ghost', 'images/ghost.png', 32, 32, 12);

        this.load.json('JSONobj', 'assets/tiles1.json');
        this.load.image('pellet', 'assets/pellet.png');
        

        //var tilemap = JSON.parse('assets/tiles1.json');
        //tilemapData = tilemap.layers.data;
        //console.log(jsonfile);
        //this.pelletHelper(tilemapData);
    },

    create: function() {
        var jsonfile = this.cache.getJSON('JSONobj');
        var data = jsonfile.layers[0].data;
        this.pelletHelper(data);
//        var pellet = this.add.sprite(10, 10, 'pellet');
//            pellet.scale.x = 0.5;
//            pellet.scale.y = 0.5;
//
//        var pellet = this.add.sprite(120, 120, 'pellet');
//            pellet.scale.x = 0.5;
//            pellet.scale.y = 0.5;
//        var pellet = this.add.sprite(20, 20, 'pellet');
//            pellet.scale.x = 0.5;
//            pellet.scale.y = 0.5;


        // Create the map
        this.map = this.add.tilemap('map');
        this.map.addTilesetImage('Wall', 'tiles');

        this.layer = this.map.createLayer('Tile Layer 1');

        tron1 = Tron.init(this, 50, 50, 'tron');
        tron1.animations.add('walkUp', [9,10,11], 3, false, true);
        tron1.animations.add('walkDown', [0,1,2], 3, false, true);
        tron1.animations.add('walkLeft', [3,4,5], 3, false, true);
        tron1.animations.add('walkRight', [6,7,8], 3, false, true);

        tron1.upKey = this.input.keyboard.addKey(Phaser.Keyboard.UP);
    	tron1.downKey = this.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    	tron1.leftKey = this.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    	tron1.rightKey = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

        ghost1 = Ghost.init(this, 70, 70, 'ghost');
        ghost1.animations.add('walkUp', [9,10,11], 3, false, true);
        ghost1.animations.add('walkDown', [0,1,2], 3, false, true);
        ghost1.animations.add('walkLeft', [3,4,5], 3, false, true);
        ghost1.animations.add('walkRight', [6,7,8], 3, false, true);

    	ghost1.upKey = this.input.keyboard.addKey(Phaser.Keyboard.W);
    	ghost1.downKey = this.input.keyboard.addKey(Phaser.Keyboard.S);
    	ghost1.leftKey = this.input.keyboard.addKey(Phaser.Keyboard.A);
    	ghost1.rightKey = this.input.keyboard.addKey(Phaser.Keyboard.D);

        // Add score text
        this.scoreText = this.add.text(this.world.width - 128, 0, 'Score: 0');
        this.scoreText.addColor('White', 0);
    }, 

    update: function() {
        var speed = 3;

        this.updateCharPos(tron1, 3);
        this.updateCharPos(ghost1, 5);
    }, 

    updateCharPos: function(character, speed) {
        character.animations.play('walk', 3, false);
        if (character.upKey.isDown) {
                tron1.animations.play('walkUp', 3, false);

            character.y -= speed;
        } else if (character.downKey.isDown) {
            character.animations.play('walkDown', 3, false);
            character.y += speed;
        } else if (character.leftKey.isDown)
        {
            character.animations.play('walkLeft', 3, false);
            character.x -= speed;
            if (character.x < 0) {
                character.x = this.world.width;
            }

        } else if (character.rightKey.isDown) {
            character.animations.play('walkRight', 3, false);
            character.x += speed;
            if (character.x > this.world.width) {
                character.x = 0;
            }
        }

        return {x: character.x, y: character.y};
    }, 

    pelletHelper: function(mapArray){
        var pelletArr = [];
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
                pellet.scale.x = 0.05;
                pellet.scale.y = 0.05;
            }
        }
        
//        for(i = 0; i < pelletArr.length ; i++){
//            var entry = pelletArr[i];
//            var pellet = this.add.sprite(entry[0], entry[1], 'pellet');
//            pellet.scale.x = 0.5;
//            pellet.scale.y = 0.5;
//        }
    },


    // pelletHelper: function(tilemapdata) {
    //     console.log(tilemapdata);
    // }
};



