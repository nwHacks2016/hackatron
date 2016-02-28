Hackatron = {
    score: 0
};

Hackatron.Game = function(game) {
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
        this.load.image('tron', 'assets/bluesprite.png');
        this.load.image('ghost', 'assets/yellowsprite.png');
        this.load.image('tiles', 'assets/part2_tileset.png');
        this.load.text();
    },

    create: function() {
        this.map = this.add.tilemap('map');
        this.map.addTilesetImage('Wall', 'tiles');

        this.layer = this.map.createLayer('Tile Layer 1');
        this.layer.resizeWorld();

        tron1 = Tron.init(this, 50, 50, 'tron');
        tron1.scale.x = 0.2;
        tron1.scale.y = 0.2;
        ghost1 = Ghost.init(this, 70, 70, 'ghost');
        ghost1.scale.x = 0.2;
        ghost1.scale.y = 0.2;

        upKey = this.input.keyboard.addKey(Phaser.Keyboard.UP);
    	downKey = this.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    	leftKey = this.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    	rightKey = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

        this.score = new Text(this, 10, 10, "Score: ");

        this.scoreText = this.add.bitmapText(8, 360, 'gameFont', 'score: 0', 16);
    }, 

    update: function() {

    	if (upKey.isDown) {
    		tron1.up();
    	}
    	else if (downKey.isDown)
    	{
        	tron1.down();
    	}

    	if (leftKey.isDown)
    	{
        	tron1.left();
    	}
    	else if (rightKey.isDown)
    	{
        	tron1.right();
    	}
    }
};



