function extendTilemap(tilemap) {
    /**
    * @property {array} collideIndexes - An array of tile indexes that collide.
    */
    tilemap.collideIndexes = [];


    /**
    * Gets the TilemapLayer index as used in the setCollision calls.
    *
    * @method Phaser.Tilemap#getLayer
    * @protected
    * @param {number|string|Phaser.TilemapLayer} layer - The layer to operate on. If not given will default to this.currentLayer.
    * @return {number} The TilemapLayer index.
    */
    tilemap.getLayer = function (layer) {

        if (layer === undefined)
        {
            layer = this.currentLayer;
        }
        else if (typeof layer === 'string')
        {
            layer = this.getLayerIndex(layer);
        }
        else if (layer instanceof Phaser.Plugin.Tiled.Tilelayer)
        {
            layer = layer.index;
        }

        return layer;

    }.bind(tilemap);

    /**
    * Sets collision the given tile or tiles. You can pass in either a single numeric index or an array of indexes: [ 2, 3, 15, 20].
    * The `collides` parameter controls if collision will be enabled (true) or disabled (false).
    *
    * @method Phaser.Tilemap#setCollision
    * @param {number|array} indexes - Either a single tile index, or an array of tile IDs to be checked for collision.
    * @param {boolean} [collides=true] - If true it will enable collision. If false it will clear collision.
    * @param {number|string|Phaser.TilemapLayer} [layer] - The layer to operate on. If not given will default to this.currentLayer.
    * @param {boolean} [recalculate=true] - Recalculates the tile faces after the update.
    */
    tilemap.setCollision = function (indexes, collides, layer, recalculate) {

        if (collides === undefined) { collides = true; }
        if (recalculate === undefined) { recalculate = true; }

        layer = this.getLayer(layer);

        if (typeof indexes === 'number')
        {
            return this.setCollisionByIndex(indexes, collides, layer, true);
        }
        else if (Array.isArray(indexes))
        {
            //  Collide all of the IDs given in the indexes array
            for (var i = 0; i < indexes.length; i++)
            {
                this.setCollisionByIndex(indexes[i], collides, layer, false);
            }

            if (recalculate)
            {
                //  Now re-calculate interesting faces
                this.calculateFaces(layer);
            }
        }

    }.bind(tilemap);

    /**
    * Sets collision on a range of tiles where the tile IDs increment sequentially.
    * Calling this with a start value of 10 and a stop value of 14 would set collision for tiles 10, 11, 12, 13 and 14.
    * The `collides` parameter controls if collision will be enabled (true) or disabled (false).
    *
    * @method Phaser.Tilemap#setCollisionBetween
    * @param {number} start - The first index of the tile to be set for collision.
    * @param {number} stop - The last index of the tile to be set for collision.
    * @param {boolean} [collides=true] - If true it will enable collision. If false it will clear collision.
    * @param {number|string|Phaser.TilemapLayer} [layer] - The layer to operate on. If not given will default to this.currentLayer.
    * @param {boolean} [recalculate=true] - Recalculates the tile faces after the update.
    */
    tilemap.setCollisionBetween = function (start, stop, collides, layer, recalculate) {

        if (collides === undefined) { collides = true; }
        if (recalculate === undefined) { recalculate = true; }

        layer = this.getLayer(layer);

        if (start > stop)
        {
            return;
        }

        for (var index = start; index <= stop; index++)
        {
            this.setCollisionByIndex(index, collides, layer, false);
        }

        if (recalculate)
        {
            //  Now re-calculate interesting faces
            this.calculateFaces(layer);
        }

    }.bind(tilemap);


    /**
    * Sets collision values on a tile in the set.
    * You shouldn't usually call this method directly, instead use setCollision, setCollisionBetween or setCollisionByExclusion.
    *
    * @method Phaser.Tilemap#setCollisionByIndex
    * @protected
    * @param {number} index - The index of the tile on the layer.
    * @param {boolean} [collides=true] - If true it will enable collision on the tile. If false it will clear collision values from the tile.
    * @param {number} [layer] - The layer to operate on. If not given will default to this.currentLayer.
    * @param {boolean} [recalculate=true] - Recalculates the tile faces after the update.
    */
    tilemap.setCollisionByIndex = function (index, collides, layer, recalculate) {

        if (collides === undefined) { collides = true; }
        if (layer === undefined) { layer = this.currentLayer; }
        if (recalculate === undefined) { recalculate = true; }

        if (collides)
        {
            this.collideIndexes.push(index);
        }
        else
        {
            var i = this.collideIndexes.indexOf(index);

            if (i > -1)
            {
                this.collideIndexes.splice(i, 1);
            }
        }

        for (var y = 0; y < this.layers[layer].size.y; y++)
        {
            for (var x = 0; x < this.layers[layer].size.x; x++)
            {
                var tile = this.layers[layer].tilesOriginal[y][x];

                if (tile && tile.id === index)
                {
                    if (collides)
                    {
                        tile.setCollision(true, true, true, true);
                    }
                    else
                    {
                        tile.resetCollision();
                    }

                    tile.faceTop = collides;
                    tile.faceBottom = collides;
                    tile.faceLeft = collides;
                    tile.faceRight = collides;
                }
            }
        }

        if (recalculate)
        {
            //  Now re-calculate interesting faces
            this.calculateFaces(layer);
        }

        return layer;

    }.bind(tilemap);
}


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
    //extendTilemap(this.tilemap);

    // layer = map.createLayer('Background');

    this.collideTiles = this.game.physics.arcade.convertTiledmap(this.tilemap, 'Background', true);

    //this.tilemap.layer.resizeWorld();

    // this.tilemap.layer = 2;
    // this.tilemap.layer.resizeWorld();
//this.tilemap.layers[2].tiles
    //this.tilemap = this.game.add.tilemap('mapData');
    //this.tilemap.addTilesetImage(Hackatron.mapConfig.tilesetKey, cacheKey('my-tiledmap', 'tileset', 'general'));

    this.tween = this.game.add.tween(this.tilemap.layers[1]).to({alpha: 0}, 250, 'Linear', true, 0, -1, true);
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
