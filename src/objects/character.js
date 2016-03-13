var Character = function() {
};

Character.prototype.init = function(params) {
    this.game = params.game;
    this.sprite = this.game.add.sprite(params.x, params.y, params.characterKey);
    this._initSprite(params);
};

// Method for registering hardware keys to a given sprite
Character.prototype.setUpKeys = function(keys) {
    if (!keys) return;

    this.sprite.upKey = this.game.input.keyboard.addKey(keys.up);
    this.sprite.downKey = this.game.input.keyboard.addKey(keys.down);
    this.sprite.leftKey = this.game.input.keyboard.addKey(keys.left);
    this.sprite.rightKey = this.game.input.keyboard.addKey(keys.right);
};

Character.prototype._initSprite = function(params) {
    this.game.physics.arcade.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.scale.x = 0.8;
    this.sprite.scale.y = 0.8;
    this.setUpKeys(params.keys);
    this._addAnimationsToSprite(this.sprite);

    var emitter = this.game.add.emitter(this.sprite.x, this.sprite.y, 50);
    emitter.width = 5;
    emitter.makeParticles(params.emitterKey);
    emitter.setXSpeed();
    emitter.setYSpeed();
    emitter.setRotation();
    emitter.setAlpha(1, 0.4, 800);
    emitter.setScale(0.2, 0.05, 0.2, 0.05, 2000, Phaser.Easing.Quintic.Out);
    emitter.start(false,250, 1);

    this.sprite.emitter = emitter;
};

Character.prototype._addAnimationsToSprite = function() {
    this.sprite.animations.add('walkUp', [9,10,11], 3, false, true);
    this.sprite.animations.add('walkDown', [0,1,2], 3, false, true);
    this.sprite.animations.add('walkLeft', [3,4,5], 3, false, true);
    this.sprite.animations.add('walkRight', [6,7,8], 3, false, true);
};
