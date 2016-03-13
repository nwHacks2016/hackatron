function randNum() {
    return Math.floor((Math.random() * 1000) % 512 + 11);
}


var Portal = function() {
};

Portal.prototype.constructor = Portal;

Portal.prototype.init = function(game) {
    this.entryPortal = game.add.sprite(randNum(), randNum(), "poop");
    this.exitPortal = game.add.sprite(randNum(), randNum(), "poop");
    game.physics.arcade.enable(this.entryPortal, Phaser.Physics.ARCADE);
    game.physics.arcade.enable(this.exitPortal, Phaser.Physics.ARCADE);

    this.entryPortal.scale.x = 0.8;
    this.entryPortal.scale.y = 0.8;
    this.exitPortal.scale.x = 0.8;
    this.exitPortal.scale.y = 0.8;
};

Portal.prototype.update = function() {
};

