var Character = function() {
};

Character.prototype.init = function(game, x, y, key) {
    this.character = game.add.sprite(x, y, key);
};