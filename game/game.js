Hackatron = {
    score: 0
};

Hackatron.Game = function(game) {
};

Hackatron.Game.prototype = {
    preload: function() {
        this.load.tilemap('map', 'assets/tiles1.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles', 'assets/part2_tileset.png');
        this.load.text();
    },

    create: function() {
        this.map = this.add.tilemap('map');
        this.map.addTilesetImage('Wall', 'tiles');

        this.layer = this.map.createLayer('Tile Layer 1');
        this.layer.resizeWorld();

        this.scoreText = this.add.bitmapText(8, 360, 'gameFont', 'score: 0', 16);
    }, 

    update: function() {
    }
};



