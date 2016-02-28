Tron = {
    score: 0
};

Tron.Game = function(game) {
};

Tron.Game.prototype = {
    preload: function() {
        this.load.tilemap('map', 'assets/tiles1.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles', 'assets/plums.png');
    },

    create: function() {
        this.map = this.add.tilemap('map');
        this.map.addTilesetImage('tile set', 'tiles');

        this.layer = this.map.createLayer('Tile Layer 1');
        this.layer.resizeWorld();
    }, 

    update: function() {
    }
};



