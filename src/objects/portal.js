

var Portal = function() {
};

Portal.prototype.constructor = Portal;

Portal.prototype.init = function(game, data) {
    this.data = data;
    console.log(data);
    this.isEntryGood = false;
    this.isExitGood = false
    var entryPortalCoord;
    var exitPortalCoord;
    while (!this.isExitGood || !this.isEntryGood) {
        if (!this.isEntryGood) {
            entryPortalCoord = this.checkIfValidCoord(game.rnd.integerInRange(0, 32), game.rnd.integerInRange(0, 32));
            this.isEntryGood = entryPortalCoord.clean;
        }
        if (!this.isExitGood) {
            exitPortalCoord = this.checkIfValidCoord(game.rnd.integerInRange(0, 32), game.rnd.integerInRange(0, 32));
            this.isExitGood = exitPortalCoord.clean;
        }

    }
    console.log("entry x: " + entryPortalCoord.x + "\ny: " + entryPortalCoord.y);
    console.log("exit x: " + exitPortalCoord.x + "\ny: " + exitPortalCoord.y);
    this.entryPortal = game.add.sprite(entryPortalCoord.x, entryPortalCoord.y, "poop");
    this.exitPortal = game.add.sprite(exitPortalCoord.x, exitPortalCoord.y, "blueball");
    game.physics.arcade.enable(this.entryPortal, Phaser.Physics.ARCADE);
    game.physics.arcade.enable(this.exitPortal, Phaser.Physics.ARCADE);

    this.entryPortal.scale.x = 0.5;
    this.entryPortal.scale.y = 0.5;
    this.exitPortal.scale.x = 0.5;
    this.exitPortal.scale.y = 0.5;
};

Portal.prototype.update = function() {
};

Portal.prototype.checkIfValidCoord = function(x, y) {
    // data goes top to down and left to right
    var value = this.data[y * 32 + x];
    console.log(value);
    var clean = true;
    if (value !== 0)
        clean = false;
    return {
        clean: clean,
        x: x / 32 * 32 + 20, // floor it and make it the mutiple of 32
        y: y * 32 % 470
    }
}