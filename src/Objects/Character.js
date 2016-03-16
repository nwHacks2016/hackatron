class Character extends GameObject {
    toString() {
        return '[Character]';
    }

    init(params) {
        super.init(params);

        this.isAlive = true;
        this.dirty = false;
        this.points = 0;
        this.game = params.game;
        this.speed = params.speed;

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

    _addAnimationsToSprite() {
        this.sprite.animations.add('walkUp', [9,10,11], 3, false, true);
        this.sprite.animations.add('walkDown', [0,1,2], 3, false, true);
        this.sprite.animations.add('walkLeft', [3,4,5], 3, false, true);
        this.sprite.animations.add('walkRight', [6,7,8], 3, false, true);
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
        this.sprite.emitter.on = true;

        //console.log(this.name + ' ' + this.sprite.x + ',' + this.sprite.y);

        if (this.sprite.upKey.isDown) {
            this.sprite.animations.play('walkUp', 3, false);
            this.sprite.body.velocity.y = -this.speed;
            this.sprite.emitter.x = this.sprite.x + 15;
            this.sprite.emitter.y = this.sprite.y + 35;
            this.direction = 'walkUp';
            this.dirty = true;
        } else if (this.sprite.downKey.isDown) {
            this.sprite.animations.play('walkDown', 3, false);
            this.sprite.body.velocity.y = this.speed;
            this.sprite.emitter.x = this.sprite.x + 15;
            this.sprite.emitter.y = this.sprite.y + -5;
            this.direction = 'walkDown';
            this.dirty = true;
        } else if (this.sprite.leftKey.isDown) {
            this.sprite.animations.play('walkLeft', 3, false);
            this.sprite.body.velocity.x = -this.speed;
            this.sprite.emitter.x = this.sprite.x + 30;
            this.sprite.emitter.y = this.sprite.y + 15;
            this.direction = 'walkLeft';
            this.dirty = true;
        } else if (this.sprite.rightKey.isDown) {
            this.sprite.animations.play('walkRight', 3, false);
            this.sprite.body.velocity.x = this.speed;
            this.sprite.emitter.x = this.sprite.x;
            this.sprite.emitter.y = this.sprite.y + 15;
            this.direction = 'walkRight';
            this.dirty = true;
        } else {
            this.sprite.emitter.on = false;
            this.direction = null;
        }
    }
}


