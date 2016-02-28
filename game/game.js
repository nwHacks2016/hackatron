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
        this.load.image('tiles', 'assets/plums.png');

        this.load.image('tron', 'assets/bluesprite.png');
        this.load.image('ghost', 'assets/yellowsprite.png');

    },

    create: function() {
        this.map = this.add.tilemap('map');
        this.map.addTilesetImage('Tileset2', 'tiles');

        this.layer = this.map.createLayer('Tile Layer 1');
        this.layer.resizeWorld();

        tron1 = Tron.init(50, 50, 'tron');
        tron1.scale.x = 0.2;
        tron1.scale.y = 0.2;
        ghost1 = Ghost.init(70, 70, 'ghost');
        ghost1.scale.x = 0.2;
        ghost1.scale.y = 0.2;

        upKey = this.input.keyboard.addKey(Phaser.Keyboard.UP);
    	downKey = this.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    	leftKey = this.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    	rightKey = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

        this.score = new Text(this, 10, 10, "Score: ");
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



