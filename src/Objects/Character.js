class Character extends GameObject {
    toString() { '[Character]' }

    init(params) {
        super.init(params);

        this.isAlive = true;
        this.dirty = false;
        this.points = 0;
        this.game = params.game;
        this.speed = params.speed;
        this.emitterKey = params.emitterKey;

        //this._addEmitterToSprite();
        this._addAnimationsToSprite();
    }

    removePoints() {
        this.points -= points;

        if (this.points < 0) {
            this.points = 0;
        }
    }

    addPoints(points) {
        this.points += points;
    }

    kill() {
        this.isAlive = false;
        this.points = 0;

        this.sprite.emitter.destroy();
        this.sprite.destroy();
    }

    _addEmitterToSprite() {
        var emitter = this.game.add.emitter(this.sprite.x, this.sprite.y, 50);
        emitter.width = 5;
        emitter.makeParticles(this.emitterKey);
        emitter.setXSpeed();
        emitter.setYSpeed();
        emitter.setRotation();
        emitter.setAlpha(1, 0.4, 800);
        emitter.setScale(0.2, 0.05, 0.2, 0.05, 2000, Phaser.Easing.Quintic.Out);
        emitter.start(false, 250, 1);

        this.sprite.emitter = emitter;

        this.aura = this.game.add.sprite(this.position.x, this.position.y, 'gfx/buffs/aura-1');
        this.aura.scale.x = 0.8;
        this.aura.scale.y = 0.8;

        this.sprite.addChild(this.aura);
    }

    changeSkin(key) {
        var oldKey = this.characterKey;
        var oldFrameName = this.sprite.frameName;

        this.sprite.animations.getAnimation('walkUp').destroy();
        this.sprite.animations.getAnimation('walkDown').destroy();
        this.sprite.animations.getAnimation('walkLeft').destroy();
        this.sprite.animations.getAnimation('walkRight').destroy();

        this.characterKey = key;

        this._addAnimationsToSprite();
        this.sprite.frameName = oldFrameName.replace(oldKey, key);
    }

    _addAnimationsToSprite() {
        // Phaser.Animation.generateFrameNames(this.characterKey + '/walkDown/', 1, 3, '', 2)
        // is equal to: [
        // this.characterKey + '/walkDown/0001', 
        // this.characterKey + '/walkDown/0002', 
        // this.characterKey + '/walkDown/0003'
        // ]

        this.sprite.animations.add('walkUp', Phaser.Animation.generateFrameNames(this.characterKey + '/walkUp-', 1, 3, '', 4), 3, false, false);
        this.sprite.animations.add('walkDown', Phaser.Animation.generateFrameNames(this.characterKey + '/walkDown-', 1, 3, '', 4), 3, false, false);
        this.sprite.animations.add('walkLeft', Phaser.Animation.generateFrameNames(this.characterKey + '/walkLeft-', 1, 3, '', 4), 3, false, false);
        this.sprite.animations.add('walkRight', Phaser.Animation.generateFrameNames(this.characterKey + '/walkRight-', 1, 3, '', 4), 3, false, false);
    }

    updatePos() {
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

        if (this.sprite.emitter) {
            this.sprite.emitter.on = true;
        }

        //console.log(this.name + ' ' + this.sprite.x + ',' + this.sprite.y);

        if (this.sprite.upKey.isDown) {
            this.sprite.animations.play('walkUp', 3, false);
            this.sprite.body.velocity.y = -this.speed;
            this.direction = 'walkUp';
            this.dirty = true;
            if (this.sprite.emitter) {
                this.sprite.emitter.x = this.sprite.x + 15;
                this.sprite.emitter.y = this.sprite.y + 35;
            }
        } else if (this.sprite.downKey.isDown) {
            this.sprite.animations.play('walkDown', 3, false);
            this.sprite.body.velocity.y = this.speed;
            this.direction = 'walkDown';
            this.dirty = true;
            if (this.sprite.emitter) {
                this.sprite.emitter.x = this.sprite.x + 15;
                this.sprite.emitter.y = this.sprite.y + -5;
            }
        } else if (this.sprite.leftKey.isDown) {
            this.sprite.animations.play('walkLeft', 3, false);
            this.sprite.body.velocity.x = -this.speed;
            this.direction = 'walkLeft';
            this.dirty = true;
            if (this.sprite.emitter) {
                this.sprite.emitter.x = this.sprite.x + 30;
                this.sprite.emitter.y = this.sprite.y + 15;
            }
        } else if (this.sprite.rightKey.isDown) {
            this.sprite.animations.play('walkRight', 3, false);
            this.sprite.body.velocity.x = this.speed;
            this.direction = 'walkRight';
            this.dirty = true;
            if (this.sprite.emitter) {
                this.sprite.emitter.x = this.sprite.x;
                this.sprite.emitter.y = this.sprite.y + 15;
            }
        } else {
            if (this.sprite.emitter) {
                this.sprite.emitter.on = false;
            }
            this.direction = null;
        }
    }
}


