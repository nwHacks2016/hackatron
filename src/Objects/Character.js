var Character = function() {
    GameObject.apply(this, arguments);
};

Character.prototype = new GameObject();

Character.prototype.constructor = Character;

Character.prototype.toString = function() {
    return '[Character]';
};

Character.prototype.init = function(params) {
    GameObject.prototype.init.apply(this, arguments);

    this.isAlive = true;
    this.dirty = false;
    this.points = 0;
    this.game = params.game;
    this.speed = params.speed;
    this.sprite = this.game.add.sprite(params.x, params.y, params.characterKey);
    this._initSprite(params);
};

Character.prototype.removePoints = function() {
    this.points -= points;

    if (this.points < 0) {
        this.points = 0;
    }
};

Character.prototype.addPoints = function(points) {
    this.points += points;
};

Character.prototype.kill = function() {
    this.isAlive = false;
    this.points = 0;

    this.sprite.emitter.destroy();
    this.sprite.destroy();
};

Character.prototype._initSprite = function(params) {
    var width = 32;
    var height = 32;
    var padding = 0.35; // 35% padding
    this.game.physics.arcade.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.setSize(width * (1 - padding), height * (1 - padding), width * padding, height * padding);
    this.sprite.scale.x = 0.8;
    this.sprite.scale.y = 0.8;

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

Character.prototype.updatePos = function() {
    if (!this.isAlive) { return; }

    if (!(this.sprite &&
        this.sprite.body &&
        this.sprite.upKey &&
        this.sprite.downKey &&
        this.sprite.leftKey &&
        this.sprite.rightKey)) {
        return;
    }

    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;
    this.sprite.emitter.on = true;

    //console.log(this.name + ' ' + this.sprite.x + ',' + this.sprite.y);

    if (this.sprite.upKey.isDown) {
        this.sprite.animations.play('walkUp', 3, false);
        this.sprite.body.velocity.y = -this.speed;
        this.sprite.emitter.x = this.sprite.x + 15;
        this.sprite.emitter.y = this.sprite.y + 35;
        if (this.sprite.y < 16) {
            this.sprite.y = 16;
        }
        this.dirty = true;
        return 'walkUp';
    } else if (this.sprite.downKey.isDown) {
        this.sprite.animations.play('walkDown', 3, false);
        this.sprite.body.velocity.y = this.speed;
        this.sprite.emitter.x = this.sprite.x + 15;
        this.sprite.emitter.y = this.sprite.y + -5;
        if (this.sprite.y > this.game.world.height - 16) {
            this.sprite.y = this.game.world.height - 16;
        }
        this.dirty = true;
        return 'walkDown';
    } else if (this.sprite.leftKey.isDown) {
        this.sprite.animations.play('walkLeft', 3, false);
        this.sprite.body.velocity.x = -this.speed;
        this.sprite.emitter.x = this.sprite.x + 30;
        this.sprite.emitter.y = this.sprite.y + 15;
        if (this.sprite.x < 0) {
            this.sprite.x = this.game.world.width;
        }
        this.dirty = true;
        return 'walkLeft';
    } else if (this.sprite.rightKey.isDown) {
        this.sprite.animations.play('walkRight', 3, false);
        this.sprite.body.velocity.x = this.speed;
        if (this.sprite.x > this.game.world.width) {
            this.sprite.x = 0;
        }
        this.sprite.emitter.x = this.sprite.x;
        this.sprite.emitter.y = this.sprite.y + 15;
        this.dirty = true;
        return 'walkRight';
    } else {
        this.sprite.emitter.on = false;
    }
};
