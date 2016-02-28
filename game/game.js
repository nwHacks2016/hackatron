Hackatron = {
    score: 0
};

Hackatron.Game = function(game) {
    this.player;
};

var tron1;
var ghost1;

var upKey;
var downKey;
var leftKey;
var rightKey;
var emitter;

Hackatron.Game.prototype = {
    preload: function() {
        this.load.tilemap('map', 'assets/tiles1.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles', 'assets/part2_tileset.png');
        this.load.spritesheet('tron', 'images/tron.png', 32, 32, 12);
        this.load.spritesheet('ghost', 'images/ghost.png', 32, 32, 12);
		this.load.image('blueball', 'images/blueball.png');
    },

    create: function() {
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

        ghost1 = Ghost.init(this, 50, 50, 'ghost');
        ghost1.animations.add('walkUp', [9,10,11], 3, false, true);
        ghost1.animations.add('walkDown', [0,1,2], 3, false, true);
        ghost1.animations.add('walkLeft', [3,4,5], 3, false, true);
        ghost1.animations.add('walkRight', [6,7,8], 3, false, true);

    	ghost1.upKey = this.input.keyboard.addKey(Phaser.Keyboard.W);
    	ghost1.downKey = this.input.keyboard.addKey(Phaser.Keyboard.S);
    	ghost1.leftKey = this.input.keyboard.addKey(Phaser.Keyboard.A);
    	ghost1.rightKey = this.input.keyboard.addKey(Phaser.Keyboard.D);

		emitter = this.add.emitter(tron1.x, tron1.y, 50);
		emitter.width = 5;
		emitter.makeParticles('blueball');
		emitter.setXSpeed();
		emitter.setYSpeed();
		emitter.setRotation();
		emitter.setAlpha(1, 0.01, 800);
		emitter.setScale(0.05, 0.4, 0.05, 0.4, 2000, Phaser.Easing.Quintic.Out);
		emitter.start(false,500, 2);
		
		
		
        // Add score text
        this.scoreText = this.add.text(this.world.width - 128, 0, 'Score: 0');
        this.scoreText.addColor('White', 0);
    }, 

    update: function() {
        this.updateCharPos(tron1, 3);
        this.updateCharPos(ghost1, 5);
    }, 

    updateCharPos: function(character, speed) {
        if (character.upKey.isDown) {
            character.animations.play('walkUp', 3, false);
            character.y -= speed;
			emitter.x = tron1.x + 15;
			emitter.y = tron1.y + 30;
        } else if (character.downKey.isDown) {
            character.animations.play('walkDown', 3, false);
            character.y += speed;
			emitter.x = tron1.x + 15;
			emitter.y = tron1.y;

        } else if (character.leftKey.isDown) {
            character.animations.play('walkLeft', 3, false);
            character.x -= speed;
            if (character.x < 0) {
                character.x = this.world.width;
            }
			emitter.x = tron1.x + 50;
			emitter.y = tron1.y + 15;
        } else if (character.rightKey.isDown) {
            character.animations.play('walkRight', 3, false);
            character.x += speed;
            if (character.x > this.world.width) {
                character.x = 0;
            }
			emitter.x = tron1.x;
			emitter.y = tron1.y + 15;
        }

        return {x: character.x, y: character.y};
    }
};



