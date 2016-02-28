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

Hackatron.Game.prototype = {
    preload: function() {
        this.load.tilemap('map', 'assets/tiles1.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('ghost', 'assets/yellowsprite.png');
        this.load.image('tiles', 'assets/part2_tileset.png');
        this.load.spritesheet('tron', 'images/tron.png', 32, 32, 12);
    },

    create: function() {
        // Create the map
        this.map = this.add.tilemap('map');
        this.map.addTilesetImage('Wall', 'tiles');


        this.layer = this.map.createLayer('Tile Layer 1');

        tron1 = Tron.init(this, 50, 50, 'tron');
        tron1.animations.add('walk');

        ghost1 = Ghost.init(this, 70, 70, 'ghost');
        ghost1.scale.x = 0.2;
        ghost1.scale.y = 0.2;

        tron1.upKey = this.input.keyboard.addKey(Phaser.Keyboard.UP);
    	tron1.downKey = this.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    	tron1.leftKey = this.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    	tron1.rightKey = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

    	wKey = this.input.keyboard.addKey(Phaser.Keyboard.W);
    	sKey = this.input.keyboard.addKey(Phaser.Keyboard.S);
    	aKey = this.input.keyboard.addKey(Phaser.Keyboard.A);
    	dKey = this.input.keyboard.addKey(Phaser.Keyboard.D);


        // Add score text
        this.scoreText = this.add.text(this.world.width - 128, 0, 'Score: 0');
        this.scoreText.addColor('White', 0);
    }, 

    update: function() {

        // tron1 controls
        tron1.animations.play('walk', 3, false);
    	if (upKey.isDown) {
    		tron1.y -= 5;
    	}
    	else if (downKey.isDown)
    	{
        	tron1.y += 5;
    	}

    	if (leftKey.isDown)
    	{
        	tron1.x -= 5;
            if (tron1.x < 0) {
                tron1.x = this.world.width;
            }
    	}
    	else if (rightKey.isDown)
    	{
        	tron1.x += 5;
            if (tron1.x > this.world.width) {
                tron1.x = 0;
            }
    	}

        // ghost1 controls
        if (wKey.isDown) {
            ghost1.y -= 5;
        }
        else if (sKey.isDown)
        {
            ghost1.y += 5;
        }

        if (aKey.isDown)
        {
            ghost1.x -= 5;
            if (ghost1.x < 0) {
                ghost1.x = this.world.width;
            }
        }
        else if (dKey.isDown)
        {
            ghost1.x += 5;
            if (ghost1.x > this.world.width) {
                ghost1.x = 0;
            }
        }
    }, 
};

var updateCharPos(character) {
    if (character.upKey.isDown) {
        character.y -= 5;
    }
    else if (character.downKey.isDown)
    {
        character.y += 5;
    }

    if (character.leftKey.isDown)
    {
        character.x -= 5;
        if (character.x < 0) {
            character.x = this.world.width;
        }
    }
    else if (character.rightKey.isDown)
    {
        character.x += 5;
        if (character.x > this.world.width) {
            character.x = 0;
        }
    }

    return {x: character.x, y: character.y};
};

