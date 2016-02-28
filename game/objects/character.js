var Character = {};

Character.init = function(game, x, y, key) {
    var character = game.add.sprite(x, y, key);

    return character;
};

Character.protoype.getPosition = function() {
    return {x: this.x, y: this.y};
};
