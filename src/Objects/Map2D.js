function Map2D() {
}

Map2D.prototype.toString = function() {
    return '[Map]';
};

Map2D.prototype.init = function(params) {
    this.game = params.game;

    this.tilemap = this.game.add.tilemap('tilesetMap');
    this.tilemap.addTilesetImage(Hackatron.mapConfig.tilesetKey, 'tilesetImage');

    this.data = this.tilemap.layers[0].data;

    this.layer = this.tilemap.createLayer('Base');
    this.layer.resizeWorld();

    // Collision
    //this.game.physics.arcade.enable(this.layer);

    var nonGroundTilesMap = {};
    var nonGroundTiles = [];

    this.data.forEach(function(column) {
        column.forEach(function(cell) {
            if (cell.index !== Hackatron.mapConfig.floorTile) {
                nonGroundTilesMap[cell.index] = true;
            }
        });
    });

    for (index in nonGroundTilesMap) {
        nonGroundTiles.push(parseInt(index));
    }

    this.tilemap.setCollision(nonGroundTiles);
};

Map2D.prototype.enablePowerups = function(params) {
    
};
