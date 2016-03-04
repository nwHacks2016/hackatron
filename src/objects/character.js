var Character = function() {
};

Character.prototype.init = function(game, x, y, key) {
    this.sprite = game.add.sprite(x, y, key);
};
