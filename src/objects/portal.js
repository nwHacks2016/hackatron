

var Portal = function() {
};

Portal.prototype.constructor = Portal;

Portal.prototype.init = function(game, data) {
    this.data = data;
    console.log(data);
    this.bIsEntryGood = false;
    this.bIsExitGood = false
    var entryPortalCoord;
    var exitPortalCoord;
    while (!this.bIsExitGood || !this.bIsEntryGood) {
        if (!this.bIsEntryGood) {
            entryPortalCoord = this.checkIfVaildCoord(game.rnd.integerInRange(0, 32), game.rnd.integerInRange(0, 32));
            this.bIsEntryGood = entryPortalCoord.clean;
        }
        if (!this.bIsExitGood) {
            exitPortalCoord = this.checkIfVaildCoord(game.rnd.integerInRange(0, 32), game.rnd.integerInRange(0, 32));
            this.bIsExitGood = exitPortalCoord.clean;
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

Portal.prototype.checkIfVaildCoord = function(x, y) {
    // data goes top to down and left to right
    var value = this.data[y * 32 + x];
    console.log(value);
    var bClean = true;
    if (value !== 0)
        bClean = false;
    return {
        clean: bClean,
        x: x / 32 * 32 + 20, // floor it and make it the mutiple of 32
        y: y * 32 % 470
    }
}