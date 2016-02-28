var Character = {};

Character.init = function(game, x, y, key) {
    var character = game.add.sprite(x, y, key);

    return character;
};

Character.protoype.up = function() {
    this.y = this.y + 1;
};

Character.protoype.down = function() {
    this.y = this.y - 1;
};

Character.protoype.left = function() {
    this.x = this.x - 1;
};

Character.protoype.right = function() {
    this.x = this.x + 1;
};

Character.protoype.getPosition = function() {
    return {x: this.x, y: this.y};
};
