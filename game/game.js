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
        var addAdminations = function(character) {
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

        tron1 = Tron.init(this, 50, 50, 'tron');
        addAdminations(tron1);
        setKeys(tron1, this, Keyboard.UP, Keyboard.DOWN, Keyboard.LEFT, Keyboard.RIGHT);

        ghost1 = Ghost.init(this, 50, 50, 'ghost');
        addAdminations(ghost1);
        setKeys(ghost1, this, Keyboard.W, Keyboard.S, Keyboard.A, Keyboard.D);
    
        // Collision
        this.physics.enable(this.layer);
        this.physics.enable(tron1, Phaser.Physics.ARCADE);
        this.physics.enable(ghost1, Phaser.Physics.ARCADE);
        this.map.setCollision(18);
        this.map.setCollision(88);
        this.map.setCollision(89);
        this.map.setCollision(53);
        this.map.setCollision(52);

        tron1.body.immovable = true;
        tron1.body.collideWorldBounds = true;

        ghost1.body.immovable = true;
        ghost1.body.collideWorldBounds = true;

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
        this.physics.arcade.collide(tron1, this.layer)
        this.physics.arcade.collide(ghost1, this.layer)
        this.updateCharPos(tron1, 200);
        this.updateCharPos(ghost1, 200);
    }, 

    updateCharPos: function(character, speed) {
        character.body.velocity.x = 0;
        character.body.velocity.y = 0;
        if (character.upKey.isDown) {
            character.animations.play('walkUp', 3, false);
            character.body.velocity.y = -speed;
			emitter.x = tron1.x + 15;
			emitter.y = tron1.y + 30;
        } else if (character.downKey.isDown) {
            character.animations.play('walkDown', 3, false);
            character.body.velocity.y = speed;
			emitter.x = tron1.x + 15;
			emitter.y = tron1.y;
        } else if (character.leftKey.isDown) {
            character.animations.play('walkLeft', 3, false);
            character.body.velocity.x = -speed;
            if (character.x < 0) {
                character.x = this.world.width;
            }
			emitter.x = tron1.x + 50;
			emitter.y = tron1.y + 15;
        } else if (character.rightKey.isDown) {
            character.animations.play('walkRight', 3, false);
            character.body.velocity.x = speed;
            if (character.x > this.world.width) {
                character.x = 0;
            }
			emitter.x = tron1.x;
			emitter.y = tron1.y + 15;
        }

        return {x: character.x, y: character.y};
    }
};



