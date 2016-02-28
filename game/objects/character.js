var Character = {};

Character.init = function(game, x, y, key) {
    var character = game.add.sprite(x, y, key);
	game.physics.arcade.enableBody(this);
    return character;
};
