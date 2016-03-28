var Gameover = function() {
};

Gameover.prototype.init = function(game) {
    this.game = game;
};

Gameover.prototype.start = function() {
    var self = this;
    var tween = null;
    var centerX = self.game.camera.width / 2;
    var centerY = self.game.camera.height / 2;

    // Gameover
    var count = self.game.add.sprite(centerX, centerY, 'gfx/overlays/gameover');
    //count.body.moves = false;
    count.anchor.setTo(0.5);
    tween = self.game.add.tween(count.scale).to({ x: 2.5, y: 2.5}, 600, Phaser.Easing.Exponential.In, true);
};
