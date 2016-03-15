var Enemy = function() {
};

Enemy.prototype.toString = function() {
    return '[Enemy]';
};

Enemy.prototype.init = function(params) {
    params.characterKey = 'ghost';
    params.emitterKey = 'poop';
    this.character = new Ghost(params);
    this.character.init(params);

    this.id = params.id;
    this.game = params.game;

    if (params.keys) {
        this.setupKeys(params.keys);
    }
};

Enemy.prototype.setupKeys = function(keys) {
    this.character.sprite.upKey = this.game.input.keyboard.addKey(keys.up);
    this.character.sprite.downKey = this.game.input.keyboard.addKey(keys.down);
    this.character.sprite.leftKey = this.game.input.keyboard.addKey(keys.left);
    this.character.sprite.rightKey = this.game.input.keyboard.addKey(keys.right);
};
