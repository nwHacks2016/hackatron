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

        tron1 = this.add.sprite(50, 50, 'tron');
        tron1.scale.x = 0.2;
        tron1.scale.y = 0.2;
        ghost1 = this.add.sprite(70, 70, 'ghost');
        ghost1.scale.x = 0.2;
        ghost1.scale.y = 0.2;

        upKey = this.input.keyboard.addKey(Phaser.Keyboard.UP);
    	downKey = this.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    	leftKey = this.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    	rightKey = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT);


    }, 

    update: function() {

    	if (upKey.isDown) {
    		console.log('hi');
    		//sprite.y--;
    	}
    	else if (downKey.isDown)
    	{
        	//sprite.y++;
    	}

    	if (leftKey.isDown)
    	{
        	//sprite.x--;
    	}
    	else if (rightKey.isDown)
    	{
        	//sprite.x++;
    	}
    }
};



