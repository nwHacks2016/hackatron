var Portal = function() {
    this.entryPortal = null;
    this.exitPortal = null;
};

Portal.prototype.constructor = Portal;

Portal.prototype.init = function(game, mapData) {
    this.mapData = mapData;
    this.game = game;

    //console.log("mapData: ", mapData);

    var entryPortalCoord = this.getValidCoord();
    var exitPortalCoord = this.getValidCoord();

    //console.log("entry x: " + entryPortalCoord.x * 16 + "\ny: " + entryPortalCoord.y * 16);
    //console.log("exit x: " + exitPortalCoord.x * 16 + "\ny: " + exitPortalCoord.y * 16);

    this.entryPortal = this.game.add.sprite(entryPortalCoord.x * 16, entryPortalCoord.y * 16, "poop");
    this.exitPortal = this.game.add.sprite(exitPortalCoord.x * 16, exitPortalCoord.y * 16, "blueball");

    this.game.physics.arcade.enable(this.entryPortal, Phaser.Physics.ARCADE);
    this.game.physics.arcade.enable(this.exitPortal, Phaser.Physics.ARCADE);

    this.entryPortal.scale.x = 0.4;
    this.entryPortal.scale.y = 0.4;
    this.exitPortal.scale.x = 0.4;
    this.exitPortal.scale.y = 0.4;
};

Portal.prototype.update = function() {
};

Portal.prototype.getValidCoord = function(x, y) {
    var coord = null;

    while (!coord) {
        var x = this.game.rnd.integerInRange(0, 31);
        var y = this.game.rnd.integerInRange(0, 31);
        // mapData goes top to down and left to right
        var cell = this.mapData[x][y].index;

        //console.log(cell);

        if (cell === -1) {
            coord = {x: x, y: y};
        }
    }

    //console.log(coord);

    return coord;
}