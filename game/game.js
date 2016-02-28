Hackatron = {
    score: 0
};

Hackatron.Game = function(game) {
};

Hackatron.Game.prototype = {
    preload: function() {
        this.load.tilemap('map', 'assets/tiles1.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles', 'assets/plums.png');
    },

    create: function() {
        this.map = this.add.tilemap('map');
        this.map.addTilesetImage('Tileset2', 'tiles');

        this.layer = this.map.createLayer('Tile Layer 1');
        this.layer.resizeWorld();

        this.score = new Text(this, 10, 10, "Score: ");
    }, 

    update: function() {
    }
};



