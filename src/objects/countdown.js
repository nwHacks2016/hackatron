var Countdown = function() {
};

Countdown.prototype.init = function(game) {
    var centerX = game.camera.width / 2;
    var centerY = game.camera.height / 2;
    this.game = game;
    this.sprite = game.add.sprite(centerX, centerY, 'countdown');
};
