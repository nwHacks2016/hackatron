function Map2D() {
}

Map2D.prototype.toString = function() {
    return '[Map]';
};

Map2D.prototype.init = function(params) {
    this.game = params.game;

    // add the tiledmap to the game
    // this method takes the key for the tiledmap which has been used in the cacheKey calls
    // earlier, and an optional group to add the tilemap to (defaults to game.world).
    //this.game.add.plugin(new Phaser.Plugin.Tiled(this.game, this.game.stage));
    this.tilemap = this.game.add.tiledmap('map');

    this.bodies = this.game.physics.p2.convertTiledmap(this.tilemap, 'Background');

    // this.tilemap.layer = 2;
    // this.tilemap.layer.resizeWorld();
//this.tilemap.layers[2].tiles
    //this.tilemap = this.game.add.tilemap('mapData');
    //this.tilemap.addTilesetImage(Hackatron.mapConfig.tilesetKey, cacheKey('my-tiledmap', 'tileset', 'general'));

    this.data = this.tilemap.layers[0].tiles;

    // this.layer = this.tilemap.createLayer('Background');
    // this.layer2 = this.tilemap.createLayer('Floor 1');
    // this.layer3 = this.tilemap.createLayer('Floor 2');
    //this.layer.resizeWorld();


    // Collision
    //this.game.physics.arcade.enable(this.layer);

    // var nonGroundTilesMap = {};
    // var nonGroundTiles = [];

    // this.data.forEach(function(column) {
    //     column.forEach(function(cell) {
    //         if (cell.index !== Hackatron.mapConfig.floorTile) {
    //             nonGroundTilesMap[cell.index] = true;
    //         }
    //     });
    // });

    // for (index in nonGroundTilesMap) {
    //     nonGroundTiles.push(parseInt(index));
    // }

    // this.tilemap.setCollision(nonGroundTiles);
};

Map2D.prototype.enablePowerups = function(params) {
    
};
